import { expect, test } from '@playwright/test'
import { makeTestIdentity, assertLocalDevFixtureTarget } from '../fixtures/test-identity.js'
import { removeTransientClient } from '../fixtures/dev-client-cleanup.js'
import { assertNoTransientClients } from '../fixtures/audit-dev-data.js'

const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'

test('SCRUM-123 | excecao simulada sempre aciona cleanup do setup', async ({ request }) => {
  assertLocalDevFixtureTarget(web, api)
  const { email } = makeTestIdentity()
  let caught = false
  try {
    const response = await request.post(api + '/api/v1/auth/register', {
      data: { name: 'Falha Controlada SCRUM 123', email, password: 'QaTeste@12345' },
    })
    expect(response.status()).toBe(202)
    // Simula uma falha DEPOIS de gravar dados, sem tornar a suite vermelha.
    throw new Error('SCRUM123_SIMULATED_TEST_FAILURE')
  } catch (error) {
    expect(String(error)).toContain('SCRUM123_SIMULATED_TEST_FAILURE')
    caught = true
  } finally {
    removeTransientClient(email)
  }
  expect(caught).toBe(true)
  expect(assertNoTransientClients().transientClients).toBe(0)
})
