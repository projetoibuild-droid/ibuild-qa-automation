# language: pt
@api @backend @regression
Funcionalidade: Contratos da API REST do IBuild
  Como QA
  Quero validar os contratos e as permissões dos endpoints
  Para prevenir regressões de autenticação e catálogo

  @smoke
  Cenário: Health check confirma disponibilidade do banco
    Quando envio uma requisição "GET" para "/health"
    Então o status HTTP deve ser 200
    E a resposta JSON deve conter a propriedade "status"

  @smoke
  Cenário: Listar produtos
    Quando envio uma requisição "GET" para "/api/products"
    Então o status HTTP deve ser 200
    E a resposta JSON deve conter a propriedade "data"

  @negative
  Cenário: Bloquear paginação inválida
    Quando envio uma requisição "GET" para "/api/products?limit=0"
    Então o status HTTP deve ser 400
    E a resposta JSON deve ter a mensagem "Limite inválido"

  @negative
  Cenário: Bloquear produto inexistente
    Quando envio uma requisição "GET" para "/api/products/nao-existe"
    Então o status HTTP deve ser 404
    E a resposta JSON deve ter a mensagem "Produto não encontrado"

  @security
  Esquema do Cenário: Bloquear operações sem autenticação
    Dado que estou sem token de autenticação
    Quando envio uma requisição "<metodo>" para "<rota>"
    Então o status HTTP deve ser 401
    E a resposta JSON deve ter a mensagem "Token ausente"
    Exemplos:
      | metodo | rota           |
      | GET    | /api/users/me  |
      | GET    | /api/orders    |
      | POST   | /api/orders    |
      | POST   | /api/products  |

  @security
  Cenário: Rejeitar token inválido
    Dado que utilizo token inválido
    Quando envio uma requisição "GET" para "/api/users/me"
    Então o status HTTP deve ser 401
    E a resposta JSON deve ter a mensagem "Token inválido ou expirado"

  @negative
  Cenário: Recusar registro com e-mail inválido
    Dado que preparo um corpo JSON "{\"name\":\"QA Teste\",\"email\":\"invalido\",\"password\":\"12345678\"}"
    Quando envio uma requisição "POST" para "/api/auth/register"
    Então o status HTTP deve ser 400

  @negative
  Cenário: Recusar cadastro com senha insuficiente
    Dado que preparo um corpo JSON "{\"name\":\"QA Teste\",\"email\":\"qa@example.com\",\"password\":\"123\"}"
    Quando envio uma requisição "POST" para "/api/auth/register"
    Então o status HTTP deve ser 400

  @negative
  Cenário: Recusar login com usuário inexistente
    Dado que preparo um corpo JSON "{\"email\":\"inexistente@example.com\",\"password\":\"incorrect\"}"
    Quando envio uma requisição "POST" para "/api/auth/login"
    Então o status HTTP deve ser 401
    E a resposta JSON deve ter a mensagem "Credenciais inválidas"
