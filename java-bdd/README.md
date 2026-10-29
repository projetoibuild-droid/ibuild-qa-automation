# IBuild — Automação Java, Selenium, Rest Assured e Cucumber

Módulo independente da suíte Playwright existente. Objetivo: exemplificar testes black-box para apresentação técnica, sem alterar o produto ou os testes legados.

## Requisitos

Java 17+, Maven 3.9+, Chrome instalado e serviços IBuild em execução. Selenium Manager gerencia o ChromeDriver quando há acesso adequado à internet.

## Execução

```bash
cd java-bdd
mvn test
mvn test -Dcucumber.filter.tags="@api"
mvn test -Dcucumber.filter.tags="@web"
```

URLs padrão: frontend `http://127.0.0.1:5173`, API `http://127.0.0.1:3333`. Configure por variáveis de ambiente ou propriedades Maven:

```bash
mvn test -DWEB_BASE_URL=https://seu-front-hml -DAPI_BASE_URL=https://sua-api-hml -DAPI_HEALTH_PATH=/health
```

O endpoint `/health` **é apenas um valor de referência e precisa ser confirmado na API real**. Nenhum teste depende de usuários de produção. Não commite tokens ou credenciais.

## Relatórios

Após execução: `target/cucumber-report.html`, `target/cucumber-report.json` e relatórios Surefire. Screenshots são anexados ao relatório Cucumber em falhas de frontend.

## Jenkins

Aponte um Pipeline para `java-bdd/Jenkinsfile`. Adapte os nomes das ferramentas Jenkins (`jdk17`, `maven3`) aos nomes configurados no servidor; o exemplo utiliza agente Unix com `sh` e exige Chrome. Os servidores devem ser acessíveis a partir do agente; localhost representa o próprio agente.

## Limitações e próximos passos

- Smoke inicial: carregamento da interface e resposta HTTP de um endpoint configurável. Ainda não valida login, carrinho, pedidos ou operações de negócio.
- Antes de demonstrar como execução bem-sucedida, conferir rotas reais, executar contra DEV/HML e guardar evidências.
- Evoluir para Page Objects de fluxos de negócio, dados isolados, asserts de contrato, cenários negativos, fluxo E2E front+API e testes de regressão.
- Perfecto exige conta/credenciais e configuração específica; este módulo **não** afirma integração com Perfecto.
- Jenkinsfile incluído como exemplo configurável, não como pipeline já executado.

## Cobertura adicional de telas (baseada no código do produto)

`telas_publicas.feature`: 11 exemplos de navegação para login comprador, login lojista, cadastro de comprador e lojista, home, carrinho vazio, calculadora, favoritos vazios, recuperar senha, pedidos e endereços.

`cadastro_validacoes.feature`: 2 cenários negativos para confirmação de senha divergente e senha com menos de 6 caracteres, sem criar conta.

Os novos cenários usam tags `@screens` e `@regression`. Execute com `mvn test -Dcucumber.filter.tags="@screens"`. Os seletores/asserções foram derivados dos componentes React existentes; ainda é obrigatório executar e ajustar contra a versão implantada. Existem mais rotas do produto que requerem autenticação e massa de dados antes da automação.

## Jornadas de negócio adicionais

- `commerce.feature`: 5 variações de produto por ID (massa do catálogo existente), adicionar ao carrinho, frete para CEP 90, CEP inválido, entrada no checkout e catálogo da categoria pisos (10 cenários).
- `login.feature`: login inválido com assert da mensagem de erro da aplicação e acesso à recuperação de senha (2 cenários).
- Total atual: **33 cenários** (11 de telas + 2 de cadastro inválido + 2 smoke iniciais + 10 de comércio + 2 de login + 6 de busca).
- Para rodar apenas o comércio: `mvn test -Dcucumber.filter.tags="@commerce"`.
- Workflow GitHub Actions `java-bdd.yml`: compila os testes com `mvn test-compile`, sem depender dos servidores.

**Estado de validação:** códigos criados, ainda sem evidência de compilação bem-sucedida nem execução HTTP/navegador neste ambiente. Reavaliar os cenários contra a UI atual e adaptar os dados para HML antes de apresentar resultados. Não compartilhar credenciais ou dados reais.

- `busca.feature`: pesquisa por 5 termos existentes no catálogo e 1 pesquisa sem resultado, com asserts sobre nomes e mensagem de vazio.
- `@commerce`: executa catálogo, carrinho, login e busca; `@api`: executa apenas o smoke HTTP configurável. O backend ainda exige mapeamento de endpoints para testes de contrato e fluxos REST de negócio.
