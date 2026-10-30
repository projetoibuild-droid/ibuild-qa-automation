# language: pt
@api @backend @integration
Funcionalidade: Fluxos autenticados e regras de negócio do backend
  Como QA
  Quero testar as APIs com usuários exclusivos
  Para verificar permissões, persistência e validações

  @positive
  Cenário: Criar um comprador com token
    Dado que cadastro um comprador exclusivo para o teste
    Então a resposta do fluxo deve ter status 201
    E a resposta do fluxo deve conter "token"
    E o resultado deve incluir o email cadastrado

  @positive
  Cenário: Consultar perfil autenticado
    Dado que tenho um comprador autenticado
    Quando consulto o perfil pela API
    Então a resposta do fluxo deve ter status 200
    E o resultado deve incluir o email cadastrado

  @positive
  Cenário: Login com usuário cadastrado
    Dado que cadastro um comprador exclusivo para o teste
    Quando faço login com as credenciais cadastradas
    Então a resposta do fluxo deve ter status 200
    E a resposta do fluxo deve conter "token"

  @positive
  Cenário: Comprador consulta lista de pedidos
    Dado que tenho um comprador autenticado
    Quando consulto os pedidos pela API
    Então a resposta do fluxo deve ter status 200
    E a resposta do fluxo deve conter "data"

  @security
  Cenário: Bloquear criação de produto pelo comprador
    Dado que tenho um comprador autenticado
    Quando tento cadastrar um produto como comprador
    Então a resposta do fluxo deve ter status 403
    E a resposta do fluxo deve ter erro "Acesso negado"

  @negative
  Cenário: Não permitir cadastro com email duplicado
    Dado que cadastro um comprador exclusivo para o teste
    Quando tento cadastrar novamente o mesmo endereço de email
    Então a resposta do fluxo deve ter status 409
    E a resposta do fluxo deve ter erro "Registro já existente"

  @security
  Cenário: Login rejeita senha incorreta
    Dado que cadastro um comprador exclusivo para o teste
    Quando faço login com senha incorreta
    Então a resposta do fluxo deve ter status 401
    E a resposta do fluxo deve ter erro "Credenciais inválidas"

  @negative
  Cenário: Pedido sem itens é rejeitado
    Dado que tenho um comprador autenticado
    Quando envio um pedido sem itens
    Então a resposta do fluxo deve ter status 400

  @negative
  Cenário: Pedido com produto inexistente é rejeitado
    Dado que tenho um comprador autenticado
    Quando envio um pedido com produto inexistente
    Então a resposta do fluxo deve ter status 404
    E a resposta do fluxo deve ter erro "Produto não encontrado"

  @negative
  Cenário: Pedido com produtos duplicados é rejeitado
    Dado que tenho um comprador autenticado
    Quando envio um pedido com produtos repetidos
    Então a resposta do fluxo deve ter status 400
    E a resposta do fluxo deve ter erro "Produtos duplicados"

  @negative
  Esquema do Cenário: Pedido rejeita quantidades inválidas
    Dado que tenho um comprador autenticado
    Quando envio um pedido com quantidade inválida <quantidade>
    Então a resposta do fluxo deve ter status 400
    Exemplos:
      | quantidade |
      | 0          |
      | -1         |
      | 101        |
