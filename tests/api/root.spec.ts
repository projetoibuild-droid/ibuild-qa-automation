import { test, expect } from '@playwright/test'

test('GET / disponibiliza contrato básico da API', async ({ request }) => {
  const response = await request.get('/')
  expect(response.ok()).toBeTruthy()
})
