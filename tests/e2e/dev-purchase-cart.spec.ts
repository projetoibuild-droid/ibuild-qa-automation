import { expect, test } from '@playwright/test'
import { makeTestIdentity, assertLocalDevFixtureTarget } from '../fixtures/test-identity.js'
import { removeTransientClient } from '../fixtures/dev-client-cleanup.js'

// Este fluxo usa somente o banco DEV local e fixtures versionadas pelo seed do produto.
// Não é executado em HML/PROD: credenciais de DEV são deliberadamente restritas a localhost.
const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const localOnly = (url: string) => {
  try { return ['localhost', '127.0.0.1'].includes(new URL(url).hostname) } catch { return false }
}
const devAllowed = localOnly(web) && localOnly(api)

test.describe('SCRUM-122 | compra com serviços reais e seed DEV', () => {
  test.skip(!devAllowed, 'Fixture DEV só pode executar em localhost; nunca utilizar em PROD/HML.')
  test('cliente autentica, consulta produto e persiste carrinho após refresh', async ({ page, request }) => {
    assertLocalDevFixtureTarget(web, api)
    const { email } = makeTestIdentity()
    const password = 'QaTeste@12345'
    try {
    const registration = await request.post(`${api}/api/v1/auth/register`, { data: {
      name: 'Cliente E2E SCRUM 123', email, password,
    } })
    expect(registration.status(), 'Cadastro do cliente exclusivo de teste').toBe(202)

    const login = await request.post(`${api}/api/v1/auth/login`, { data: { email, password } })
    expect(login.ok(), 'Login API do usuário fictício DEV').toBeTruthy()
    const loginData = await login.json()
    const token = loginData.data.accessToken as string
    expect(token).toBeTruthy()
    const headers = { Authorization: `Bearer ${token}` }

    const clear = async () => request.delete(`${api}/api/v1/cart`, { headers })
    const initial = await clear()
    expect(initial.ok(), 'Limpeza inicial do carrinho DEV').toBeTruthy()

    try {
      const productResponse = await request.get(`${api}/api/v1/products/p01`)
      expect(productResponse.ok()).toBeTruthy()
      const product = (await productResponse.json()).data.product
      expect(product.purchasable).not.toBe(false)

      await page.goto('/login')
      await page.locator('input[type="email"]').fill(email)
      await page.locator('input[type="password"]').fill(password)
      await page.getByRole('button', { name: /^entrar$/i }).click()
      await expect(page).toHaveURL(/\/home(?:[/?#]|$)/)

      await page.goto(`/product/${encodeURIComponent(product.id)}`)
      await expect(page.getByRole('heading', { name: product.name })).toBeVisible()
      await page.getByRole('button', { name: /comprar agora/i }).click()
      await expect(page).toHaveURL(/\/cart(?:[/?#]|$)/)
      await expect(page.getByRole('link', { name: product.name })).toBeVisible()

      await page.reload()
      await expect(page.getByRole('link', { name: product.name })).toBeVisible()

      const persisted = await request.get(`${api}/api/v1/cart`, { headers })
      expect(persisted.ok()).toBeTruthy()
      const response = await persisted.json()
      expect(response.data.cart.items.some((item: { productId: string }) => item.productId === product.id)).toBe(true)
    } finally {
      const cleaned = await clear()
      expect(cleaned.ok(), 'Limpeza final do carrinho DEV').toBeTruthy()
    }
    } finally {
      removeTransientClient(email)
    }
  })
})
