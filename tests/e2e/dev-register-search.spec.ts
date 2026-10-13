import { expect, test } from '@playwright/test'

const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const localOnly = (value: string) => {
  try { return ['localhost', '127.0.0.1'].includes(new URL(value).hostname) }
  catch { return false }
}

test.describe('SCRUM-122 | cadastro e busca reais', () => {
  test.skip(!localOnly(web) || !localOnly(api), 'Cenários DEV exigem serviços em localhost')

  test('cadastro rejeita confirmação de senha divergente sem chamar API', async ({ page }) => {
    let registrationCalls = 0
    page.on('request', (request) => {
      if (request.method() === 'POST' && /\/api\/v1\/auth\/register/.test(request.url())) registrationCalls++
    })

    await page.goto('/register')
    await page.getByPlaceholder('Seu nome').fill('Cliente QA Validação')
    await page.getByPlaceholder('seuemail@email.com').fill('cadastro.qa@ibuild.test')
    await page.getByPlaceholder('Use uma senha segura').fill('SenhaForte@123')
    await page.getByPlaceholder('Repita a senha').fill('SenhaDiferente@123')
    await page.getByRole('button', { name: /criar conta grátis/i }).click()

    await expect(page.getByText('As senhas não conferem.')).toBeVisible()
    expect(registrationCalls, 'Não deve criar usuário quando confirmação diverge').toBe(0)
    await expect(page).toHaveURL(/\/register(?:[/?#]|$)/)
  })

  test('busca encontra produto real do seed e abre detalhes', async ({ page, request }) => {
    const health = await request.get(api + '/health')
    expect(health.ok()).toBeTruthy()

    await page.goto('/search')
    await page.getByPlaceholder('Buscar materiais, produtos...').fill('Porcelanato Polido Branco')
    await page.getByRole('button', { name: /^buscar$/i }).click()
    await expect(page.getByText('Porcelanato Polido Branco 60x60cm')).toBeVisible()
    await page.getByText('Porcelanato Polido Branco 60x60cm').click()
    await expect(page).toHaveURL(/\/product\/p01(?:[/?#]|$)/)
    await expect(page.getByRole('heading', { name: 'Porcelanato Polido Branco 60x60cm' })).toBeVisible()
  })

  test('busca inexistente mostra estado vazio', async ({ page }) => {
    await page.goto('/search')
    await page.getByPlaceholder('Buscar materiais, produtos...').fill('produto-inexistente-scrum122-qa')
    await page.getByRole('button', { name: /^buscar$/i }).click()
    await expect(page.getByText(/0 resultado\(s\)/i)).toBeVisible()
    await expect(page.getByText(/nenhum produto/i)).toBeVisible()
  })
})
