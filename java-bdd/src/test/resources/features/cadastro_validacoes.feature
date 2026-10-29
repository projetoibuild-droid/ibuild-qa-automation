# language: pt
@screens @negative @regression
Funcionalidade: Validação do cadastro do comprador
  Como visitante
  Quero receber mensagens de erro de cadastro
  Para corrigir dados inválidos sem criar contas

  Cenário: Impedir cadastro com confirmação de senha divergente
    Dado que estou na rota "/register" do IBuild
    Quando preencho o campo "Seu nome" com "QA Automatizado"
    E preencho o campo "seuemail@email.com" com "qa.nao.cadastrar@example.com"
    E preencho o campo "Mínimo 6 caracteres" com "123456"
    E preencho o campo "Repita a senha" com "654321"
    E clico no botão "Criar conta grátis"
    Então devo visualizar o texto "As senhas não conferem."

  Cenário: Impedir cadastro com senha menor que seis caracteres
    Dado que estou na rota "/register" do IBuild
    Quando preencho o campo "Seu nome" com "QA Automatizado"
    E preencho o campo "seuemail@email.com" com "qa.nao.cadastrar@example.com"
    E preencho o campo "Mínimo 6 caracteres" com "12345"
    E preencho o campo "Repita a senha" com "12345"
    E clico no botão "Criar conta grátis"
    Então devo visualizar o texto "Senha deve ter pelo menos 6 caracteres."
