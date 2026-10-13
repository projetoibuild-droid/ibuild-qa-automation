import { test, expect } from '@playwright/test'
import { assertNoTransientClients } from '../fixtures/audit-dev-data.js'

test('SCRUM-123 | nenhuma conta temporaria permanece apos E2E', () => {
  const result = assertNoTransientClients()
  expect(result.transientClients).toBe(0)
})
