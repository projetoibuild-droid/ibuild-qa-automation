import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { assertLocalDevFixtureTarget, assertOwnedFixture } from './test-identity.js'

/**
 * Cleanup Prisma exclusivo da conta temporária criada pelo próprio teste.
 * Não executa reset global nem deleta dados do seed.
 */
export function removeTransientClient(email: string) {
  const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
  const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
  assertLocalDevFixtureTarget(web, api)
  const couponCode = 'SCRUM123' + email.match(/^scrum123\.([a-f0-9]{32})@ibuild\.test$/)?.[1].toUpperCase()
  assertOwnedFixture({ email, couponCode })

  const script = [
    "const { PrismaClient } = require('@prisma/client');",
    "const prisma = new PrismaClient();",
    "const email = process.argv[1];",
    "(async () => {",
    " const user = await prisma.user.findUnique({ where: { email }, select: { id:true } });",
    " if (!user) return;",
    " await prisma.order.deleteMany({ where: { userId:user.id } });",
    " await prisma.user.delete({ where: { id:user.id } });",
    "})().finally(() => prisma.$disconnect()).catch(e => { console.error(e); process.exitCode=1 });",
  ].join('\n')
  execFileSync('docker', ['compose','exec','-T','api','node','-e',script,email], {
    cwd: process.env.IBUILD_PRODUCT_PATH || path.resolve(process.cwd(), '..', 'ibuild'),
    timeout: 20000,
    stdio: 'pipe',
  })
}
