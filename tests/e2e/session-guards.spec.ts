import { expect, test } from '@playwright/test'

// Navegador real, sem autenticação e sem massa criada manualmente.
// Os projetos API e Chromium recebem seus próprios baseURL na configuração.
test.describe('SCRUM-122 | navegação e proteção de sessão', () => {
  test('login do comprador continua acessível após refresh', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /bem-vindo de volta/i })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: /bem-vindo de volta/i })).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  for (const route of ['/cart', '/checkout', '/my-orders']) {
    test(`visitante não acessa ${route} por URL direta`, async ({ page }) => {
      await page.goto(route)
      await expect(page).toHaveURL(/\/login(?:[/?#]|$)/)
      await expect(page.locator('input[type="password"]')).toBeVisible()
    })
  }

  test('visitante não acessa dashboard do lojista por URL direta', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await expect(page).toHaveURL(/\/admin(?:[/?#]|$)/)
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })
})
