import { expect, test } from '@playwright/test'

const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const local = (value: string) => {
  try { return ['localhost', '127.0.0.1'].includes(new URL(value).hostname) }
  catch { return false }
}

test('SCRUM-122 | sessão CLIENT autenticada sobrevive a refresh e acesso direto', async ({ page }) => {
  test.skip(!local(api) || !local(web), 'Credenciais DEV somente em localhost')

  await page.goto('/login')
  await page.locator('input[type="email"]').fill('cliente1.dev@ibuild.test')
  await page.locator('input[type="password"]').fill('Dev@12345')
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
})
