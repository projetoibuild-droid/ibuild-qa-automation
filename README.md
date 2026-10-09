# iBuild QA Automation

Repositório independente para testes externos de API e ponta a ponta do marketplace iBuild.

## Responsabilidades

- **ibuild (produto):** testes unitários, componentes React e validações internas de backend.
- **ibuild-qa-automation:** testes black-box de API, E2E e futura regressão cross-service/performance.
- A migração é progressiva: os testes existentes no produto ficam preservados até a suíte externa ser executada com sucesso.

## Pré-requisitos

Node 24, npm 11 e acesso à API e ao frontend em execução (DEV local ou HML).

```bash
npm install
npx playwright install chromium
npm run typecheck
```

Copie `.env.example` para `.env`, mas note que o Playwright não carrega esse arquivo automaticamente; no Git Bash, exporte as variáveis antes de rodar:

```bash
export WEB_BASE_URL=http://127.0.0.1:5173
export API_BASE_URL=http://127.0.0.1:3333
npm run test:api
npm run test:e2e
```

A API deve estar disponível em `API_BASE_URL`, e o frontend em `WEB_BASE_URL`. Este repositório **não** inicia automaticamente os servidores; os testes falharão caso não estejam disponíveis. Não utilize dados reais de produção.

## CI

A GitHub Action inicial executa somente typecheck. Testes HTTP/E2E serão habilitados após configuração de ambiente HML acessível ao runner e secrets adequados. Nunca adicione credenciais ao Git.

## Próximos passos

1. Migrar os testes externos da SCRUM-119, mantendo temporariamente os testes do produto.
2. Adicionar fixtures isoladas e limpeza de dados para cenários autenticados.
3. Integrar o pipeline do produto à automação com gatilhos seguros e revisão de branch.
4. Adicionar k6 em um trabalho separado, sem misturar sua execução ao teste de navegador.
