import { test, expect } from '@playwright/test'
import { assertLocalDevFixtureTarget, assertOwnedFixture, makeTestIdentity } from '../fixtures/test-identity.js'

test('SCRUM-123 | fixtures geram identidades exclusivas', () => {
  const a = makeTestIdentity()
  const b = makeTestIdentity()
  expect(a.id).not.toBe(b.id)
  expect(a.email).not.toBe(b.email)
  expect(a.couponCode).not.toBe(b.couponCode)
  assertOwnedFixture(a)
  assertOwnedFixture(b)
})

test('SCRUM-123 | execução destrutiva bloqueia PROD e HML', () => {
  expect(() => assertLocalDevFixtureTarget('https://ibuild.example.com', 'https://api.example.com')).toThrow()
  expect(() => assertLocalDevFixtureTarget('http://127.0.0.1:5173', 'http://localhost:3333')).not.toThrow()
  expect(() => assertLocalDevFixtureTarget('http://127.0.0.1:5173', 'http://localhost:3334')).toThrow()
})

test('SCRUM-123 | limpeza não aceita IDs de seed compartilhado', () => {
  expect(() => assertOwnedFixture({ email: 'cliente1.dev@ibuild.test', couponCode: 'QA10' })).toThrow()
})
