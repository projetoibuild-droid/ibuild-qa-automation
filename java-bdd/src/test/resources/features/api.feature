# language: pt
@api @smoke
Funcionalidade: Disponibilidade da API IBuild
  Como QA
  Quero validar a disponibilidade da API
  Para identificar regressões no serviço

  Cenário: Endpoint de saúde responde com sucesso
    Dado que o endpoint de saúde da API está configurado
    Quando consulto o endpoint via GET
    Então a API deve responder com status de sucesso
