import { test, expect } from '@playwright/test'
import { makeTestIdentity, assertLocalDevFixtureTarget } from '../fixtures/test-identity.js'
import { removeTransientClient } from '../fixtures/dev-client-cleanup.js'

// Usa exclusivamente a massa fictícia e o backend DEV em localhost.
// É propositalmente um único teste: os passos compartilham o mesmo carrinho.
const web = process.env.WEB_BASE_URL ?? 'http://127.0.0.1:5173'
const api = process.env.API_BASE_URL ?? 'http://127.0.0.1:3333'
const local = (value: string) => {
  try { return ['localhost', '127.0.0.1'].includes(new URL(value).hostname) }
  catch { return false }
}

test('SCRUM-122 | checkout, cupom, pedido e acompanhamento reais', async ({ page, request }) => {
  test.skip(!local(web) || !local(api), 'Este cenário utiliza somente DEV local')
  assertLocalDevFixtureTarget(web, api)
  const { email } = makeTestIdentity()
  const password = 'QaTeste@12345'
  const register = await request.post(api + '/api/v1/auth/register', { data: { name: 'Comprador QA SCRUM 123', email, password } })
  expect(register.status()).toBe(202)
  try {
  const login = await request.post(api + '/api/v1/auth/login', { data: { email, password } })
  expect(login.ok()).toBeTruthy()
  const token = (await login.json()).data.accessToken as string
  const auth = { Authorization: 'Bearer ' + token }
  const merchantLogin = await request.post(api + '/api/v1/auth/login', {
    data: { email: 'lojista2.dev@ibuild.test', password: 'Dev@12345' },
  })
  expect(merchantLogin.ok()).toBeTruthy()
  const merchantAuth = { Authorization: 'Bearer ' + (await merchantLogin.json()).data.accessToken }

  const beforeResponse = await request.get(api + '/api/v1/orders?page=1&limit=100', { headers: auth })
  expect(beforeResponse.ok()).toBeTruthy()
  const before = new Set<string>((await beforeResponse.json()).data.map((order: { id: string }) => order.id))
  let orderId: string | undefined

  const clearCart = () => request.delete(api + '/api/v1/cart', { headers: auth })
  expect((await clearCart()).ok()).toBeTruthy()

  try {
    await page.goto('/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: /^entrar$/i }).click()
    await expect(page).toHaveURL(/\/home(?:[/?#]|$)/)

    await page.goto('/product/p02')
    await expect(page.getByRole('button', { name: /comprar agora/i })).toBeVisible()
    await page.getByRole('button', { name: /comprar agora/i }).click()
    await expect(page).toHaveURL(/\/cart(?:[/?#]|$)/)

    await page.getByRole('button', { name: /finalizar pedido/i }).click()
    await expect(page).toHaveURL(/\/checkout(?:[/?#]|$)/)
    await expect(page.getByRole('heading', { name: /finalizar pedido/i })).toBeVisible()

    await page.getByPlaceholder('Código do cupom').fill('SCRUM122-INVALIDO')
    await page.getByRole('button', { name: /^aplicar$/i }).click()
    await expect(page.getByText(/cupom não encontrado/i)).toBeVisible()

    await page.getByRole('button', { name: /confirmar pedido/i }).click()
    await expect(page).toHaveURL(/\/order-success(?:[/?#]|$)/)
    await expect(page.getByRole('heading', { name: /pedido recebido/i })).toBeVisible()

    const afterResponse = await request.get(api + '/api/v1/orders?page=1&limit=100', { headers: auth })
    expect(afterResponse.ok()).toBeTruthy()
    const created = (await afterResponse.json()).data.find((order: { id: string }) => !before.has(order.id))
    expect(created, 'Pedido deve existir na API').toBeTruthy()
    orderId = created.id

    await page.getByRole('link', { name: /acompanhar pedido/i }).click()
    await expect(page).toHaveURL(new RegExp('/my-orders/' + orderId + '(?:[/?#]|$)'))
    await expect(page.getByRole('heading', { name: /detalhes do pedido/i })).toBeVisible()
    await page.reload()
    await expect(page.getByRole('heading', { name: /detalhes do pedido/i })).toBeVisible()
  } finally {
    if (orderId) {
      const cancel = await request.patch(api + '/api/v1/orders/' + encodeURIComponent(orderId) + '/status', {
        headers: merchantAuth,
        data: { status: 'CANCELLED' },
      })
      expect(cancel.ok(), 'Cancelamento do pedido de QA').toBeTruthy()
    }
    expect((await clearCart()).ok(), 'Limpeza final do carrinho').toBeTruthy()
  }
  } finally {
    removeTransientClient(email)
  }
})
