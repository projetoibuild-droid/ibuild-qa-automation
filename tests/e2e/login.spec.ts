import { test, expect } from '@playwright/test'

test('rota de login do cliente abre', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveURL(/\/login(?:[/?#]|$)/)
  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})
