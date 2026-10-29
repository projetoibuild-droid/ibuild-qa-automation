# language: pt
@commerce @regression @auth
Funcionalidade: Autenticação e navegação de compradores
  Como comprador
  Quero me autenticar e acessar meu perfil
  Para utilizar as funcionalidades da conta

  @negative
  Cenário: Recusar credenciais de comprador inválidas
    Dado que navego para "/login" no marketplace
    Quando informo "inexistente@example.com" no campo "seuemail@email.com" do marketplace
    E informo "senhaerrada" no campo "••••••" do marketplace
    E clico na ação "Entrar" do marketplace
    Então devo encontrar "E-mail ou senha inválidos." no marketplace

  Cenário: Navegar para a página de recuperação de senha
    Dado que navego para "/forgot-password" no marketplace
    Então devo encontrar "Esqueci a senha" no marketplace
