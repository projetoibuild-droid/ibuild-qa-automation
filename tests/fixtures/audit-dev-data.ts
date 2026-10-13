import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { assertLocalDevFixtureTarget } from './test-identity.js'

/** Auditoria somente-leitura da massa temporária SCRUM-123 em DEV local. */
export function assertNoTransientClients() {
  const api = process.env.API_BASE_URL || 'http://127.0.0.1:3333'
  const web = process.env.WEB_BASE_URL || 'http://127.0.0.1:5173'
  assertLocalDevFixtureTarget(web, api)
  const script = [
    "const { PrismaClient } = require('@prisma/client');",
    "const prisma = new PrismaClient();",
    "(async () => {",
    " const accounts = await prisma.user.findMany({ where:{ email:{ startsWith:'scrum123.', endsWith:'@ibuild.test' } }, select:{ email:true } });",
    " const count = accounts.length;",
    " console.log(JSON.stringify({ transientClients:count }));",
    " if (count !== 0) process.exitCode=1;",
    "})().catch(e => { console.error(e); process.exitCode=1 }).finally(() => prisma.$disconnect());",
  ].join('\n')
  const output = execFileSync('docker', ['compose', 'exec', '-T', 'api', 'node', '-e', script], {
    cwd: process.env.IBUILD_PRODUCT_PATH || path.resolve(process.cwd(), '..', 'ibuild'),
    timeout: 20000,
    encoding: 'utf8',
  })
  return JSON.parse(output.trim().split('\n').at(-1) || '{}') as { transientClients: number }
}
