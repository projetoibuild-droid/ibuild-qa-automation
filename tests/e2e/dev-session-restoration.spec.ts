import { expect, test } from '@playwright/test'
import { makeTestIdentity, assertLocalDevFixtureTarget } from '../fixtures/test-identity.js'
import { removeTransientClient } from '../fixtures/dev-client-cleanup.js'

const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const local = (value: string) => {
  try { return ['localhost', '127.0.0.1'].includes(new URL(value).hostname) }
  catch { return false }
}

test('SCRUM-122 | sessão CLIENT autenticada sobrevive a refresh e acesso direto', async ({ page, request }) => {
  test.skip(!local(api) || !local(web), 'Cenário exclusivo de DEV local')
  assertLocalDevFixtureTarget(web, api)

  const { email } = makeTestIdentity()
  const password = 'QaTeste@12345'

  try {
    const registration = await request.post(api + '/api/v1/auth/register', {
      data: { name: 'Cliente Sessão SCRUM 123', email, password },
    })
    expect(registration.status()).toBe(202)

    await page.goto('/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: /^entrar$/i }).click()
    await expect(page).toHaveURL(/\/home(?:[/?#]|$)/)

    await page.goto('/my-orders')
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible()

    await page.reload()
    await expect(page).toHaveURL(/\/my-orders(?:[/?#]|$)/)
    await expect(page.getByRole('heading', { name: /meus pedidos/i })).toBeVisible()

    await page.goto('/cart')
    await expect(page).toHaveURL(/\/cart(?:[/?#]|$)/)
    await expect(page).not.toHaveURL(/\/login(?:[/?#]|$)/)
  } finally {
    removeTransientClient(email)
  }
})
