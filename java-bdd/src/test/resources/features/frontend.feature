# language: pt
@web @smoke
Funcionalidade: Carregamento do frontend IBuild
  Como visitante
  Quero acessar a aplicação
  Para validar que a interface está disponível

  Cenário: Página inicial apresenta conteúdo
    Dado que acesso a página inicial do IBuild
    Então o frontend deve apresentar conteúdo visível
    E o navegador deve apresentar um título
