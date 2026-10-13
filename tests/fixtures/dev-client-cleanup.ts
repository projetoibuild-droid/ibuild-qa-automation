import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { assertLocalDevFixtureTarget, assertOwnedFixture } from './test-identity.js'

/**
 * Cleanup exclusivamente DEV e escopado por e-mail temporário. Pedidos que
 * ainda não foram cancelados têm o estoque compensado na mesma transação
 * que remove o pedido. Não altera pedidos ou usuários de seed.
 */
export function removeTransientClient(email: string) {
  const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
  const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
  assertLocalDevFixtureTarget(web, api)
  const id = /^scrum123\.([a-f0-9]{32})@ibuild\.test$/.exec(email)?.[1]
  assertOwnedFixture({ email, couponCode: 'SCRUM123' + (id ?? '').toUpperCase() })

  const script = [
    "const { PrismaClient } = require('@prisma/client');",
    "const prisma = new PrismaClient();",
    "const email = process.argv[1];",
    "(async () => {",
    " await prisma.$transaction(async (tx) => {",
    "  const user = await tx.user.findUnique({ where:{ email }, select:{ id:true } });",
    "  if (!user) return;",
    "  const orders = await tx.order.findMany({ where:{ userId:user.id }, select:{ id:true,status:true,items:{ select:{ productId:true,qty:true } } } });",
    "  for (const order of orders) {",
    "   if (order.status !== 'CANCELLED') {",
    "    if (order.status !== 'PENDING') throw new Error('Cleanup recusado: pedido nao esta PENDING/CANCELLED');",
    "    for (const item of order.items) {",
    "     const restored = await tx.product.updateMany({ where:{ id:item.productId }, data:{ stock:{ increment:item.qty } } });",
    "     if (restored.count !== 1) throw new Error('Cleanup recusado: produto do pedido inexistente');",
    "    }",
    "   }",
    "   await tx.order.delete({ where:{ id:order.id } });",
    "  }",
    "  await tx.user.delete({ where:{ id:user.id } });",
    " });",
    "})().catch(e => { console.error(e); process.exitCode=1 }).finally(() => prisma.$disconnect());",
  ].join('\n')

  execFileSync('docker', ['compose','exec','-T','api','node','-e',script,email], {
    cwd: process.env.IBUILD_PRODUCT_PATH || path.resolve(process.cwd(), '..', 'ibuild'),
    timeout: 20000,
    stdio: 'pipe',
  })
}
