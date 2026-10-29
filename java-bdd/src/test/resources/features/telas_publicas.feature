# language: pt
@screens @regression
Funcionalidade: Telas públicas do marketplace IBuild
  Como visitante
  Quero acessar as principais telas de navegação
  Para utilizar os recursos públicos disponíveis

  Esquema do Cenário: Exibir conteúdo esperado na tela <tela>
    Dado que estou na rota "<rota>" do IBuild
    Então devo visualizar o texto "<conteudo>"

    Exemplos:
      | tela              | rota              | conteudo                 |
      | Login comprador   | /login            | Bem-vindo de volta       |
      | Login lojista     | /admin            | Acesso Administrativo    |
      | Cadastro cliente  | /register         | Criar conta              |
      | Início marketplace| /home             | O que você precisa?      |
      | Carrinho vazio    | /cart             | Carrinho vazio           |
      | Calculadora       | /calculator       | Calculadora de materiais |
