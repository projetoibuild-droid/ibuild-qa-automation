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
