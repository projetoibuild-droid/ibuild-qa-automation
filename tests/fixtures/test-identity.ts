import { randomUUID } from 'node:crypto'

/**
 * SCRUM-123: identidade exclusiva por cenário, sem dependência da ordem de execução.
 * Nunca usar IDs das fixtures compartilhadas para realizar limpeza destrutiva.
 */
export function makeTestIdentity(prefix = 'scrum123') {
  if (!/^[a-z][a-z0-9]{2,24}$/.test(prefix)) {
    throw new Error('Prefixo de fixture inválido.')
  }
  const id = randomUUID().replaceAll('-', '')
  return Object.freeze({
    id,
    email: `${prefix}.${id}@ibuild.test`,
    couponCode: `${prefix.toUpperCase()}${id.toUpperCase()}`,
  })
}

export function assertLocalDevFixtureTarget(webUrl: string, apiUrl: string) {
  for (const value of [webUrl, apiUrl]) {
    let url: URL
    try { url = new URL(value) } catch { throw new Error('URL de fixture inválida.') }
    if (
      url.protocol !== 'http:' ||
      !['127.0.0.1', 'localhost'].includes(url.hostname) ||
      !['5173', '3333'].includes(url.port) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash
    ) {
      throw new Error('Fixture destrutiva bloqueada fora de DEV local.')
    }
  }
  if (new URL(webUrl).port !== '5173' || new URL(apiUrl).port !== '3333') {
    throw new Error('Portas DEV inesperadas para fixture.')
  }
}

export function assertOwnedFixture(identity: { email: string; couponCode: string }) {
  if (
    !/^scrum123\.[a-f0-9]{32}@ibuild\.test$/.test(identity.email) ||
    !/^SCRUM123[A-F0-9]{32}$/.test(identity.couponCode)
  ) {
    throw new Error('A limpeza exige registros exclusivos SCRUM-123.')
  }
}
