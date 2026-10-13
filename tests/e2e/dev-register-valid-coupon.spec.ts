import { test, expect } from '@playwright/test'
import { randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const local = (url: string) => {
  try { return ['127.0.0.1', 'localhost'].includes(new URL(url).hostname) } catch { return false }
}

// Utilitário exclusivamente DEV. Executa Prisma dentro do contêiner API,
// sem disponibilizar rotas administrativas no produto nem depender de dados manuais.
function devFixture(action: 'create' | 'cleanup', code: string, email: string) {
  const repo = process.env.IBUILD_PRODUCT_PATH || path.resolve(process.cwd(), '..', 'ibuild')
  const script = [
    "const { PrismaClient } = require('@prisma/client');",
    "const prisma = new PrismaClient();",
    "const action = process.argv[1], code = process.argv[2], email = process.argv[3];",
    "(async () => {",
    " if (action === 'create') {",
    "   await prisma.coupon.create({ data: { code, discountType:'PERCENTAGE', value:'10.00', active:true, startsAt:new Date(Date.now()-3600000), expiresAt:new Date(Date.now()+86400000) } });",
    " } else {",
    "   await prisma.coupon.deleteMany({ where:{ code } });",
    "   await prisma.user.deleteMany({ where:{ email } });",
    " }",
    "})().finally(() => prisma.$disconnect()).catch(error => { console.error(error); process.exitCode=1 });",
  ].join('\n')
  execFileSync('docker', ['compose','exec','-T','api','node','-e',script,action,code,email], {
    cwd: repo, stdio: 'pipe', timeout: 20000,
  })
}

test('SCRUM-122 | cadastro real e cupom válido calculado no backend', async ({ page, request }) => {
  test.skip(!local(web) || !local(api), 'Fixture Prisma exclusiva de ambiente DEV local')
  const id = randomUUID().replace(/-/g, '').slice(0, 16)
  const email = 'scrum122.' + id + '@ibuild.test'
  const code = 'SCRUM122' + id.toUpperCase()
  const password = 'QaTeste@12345'
  let created = false
  try {
    devFixture('create', code, email)
    created = true

    await page.goto('/register')
    await page.getByPlaceholder('Seu nome').fill('Cliente QA SCRUM 122')
    await page.getByPlaceholder('seuemail@email.com').fill(email)
    await page.getByPlaceholder('Use uma senha segura').fill(password)
    await page.getByPlaceholder('Repita a senha').fill(password)
    await page.getByRole('button', { name: /criar conta grátis/i }).click()
    await expect(page).toHaveURL(/\/login\?registered=1/)
    await expect(page.getByText(/cadastro recebido/i)).toBeVisible()

    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: /^entrar$/i }).click()
    await expect(page).toHaveURL(/\/home(?:[/?#]|$)/)

    await page.goto('/product/p01')
    await page.getByRole('button', { name: /comprar agora/i }).click()
    await expect(page).toHaveURL(/\/cart(?:[/?#]|$)/)
    await page.getByRole('button', { name: /finalizar pedido/i }).click()
    await expect(page).toHaveURL(/\/checkout(?:[/?#]|$)/)

    await page.getByPlaceholder('Código do cupom').fill(code)
    await page.getByRole('button', { name: /^aplicar$/i }).click()
    await expect(page.getByText(code, { exact: true })).toBeVisible()
    await expect(page.getByText(/desconto aplicado pelo backend/i)).toBeVisible()

    const login = await request.post(api + '/api/v1/auth/login', { data: { email, password } })
    expect(login.ok()).toBeTruthy()
    const token = (await login.json()).data.accessToken as string
    const cart = await request.get(api + '/api/v1/cart', { headers: { Authorization: 'Bearer ' + token } })
    expect(cart.ok()).toBeTruthy()
    const cartData = (await cart.json()).data.cart
    expect(Number(cartData.discount)).toBeGreaterThan(0)
    expect(Number(cartData.total)).toBeLessThan(Number(cartData.subtotal))
  } finally {
    if (created) devFixture('cleanup', code, email)
  }
})
