# language: pt
@commerce @regression
Funcionalidade: Jornada de compra do IBuild
  Como comprador
  Quero consultar produtos e gerenciar o carrinho
  Para selecionar materiais antes do checkout

  @catalogo
  Esquema do Cenário: Consultar detalhes de produtos existentes
    Dado que navego para "/product/<id>" no marketplace
    Então devo encontrar "<nome>" no marketplace
    Exemplos:
      | id  | nome                                    |
      | p01 | Porcelanato Polido Branco 60x60cm      |
      | p02 | Cerâmica Fosca Cinza 45x45cm            |
      | p03 | Piso Laminado Madeira Natural 1,21m²   |
      | p04 | Rejunte Cinza Platina 1kg              |
      | p05 | Tinta Acrílica Premium Branco Neve 18L |

  @carrinho
  Cenário: Adicionar produto do catálogo ao carrinho
    Dado que navego para "/product/p01" no marketplace
    Quando clico na ação "Carrinho" do marketplace
    E navego para "/cart" no marketplace
    Então devo encontrar "Porcelanato Polido Branco 60x60cm" no marketplace

  @carrinho
  Cenário: Simular frete grátis para Porto Alegre
    Dado que adicionei o porcelanato do catálogo ao carrinho
    E navego para "/cart" no marketplace
    Quando informo "90000000" no campo "Digite seu CEP" do marketplace
    E clico na ação "OK" do marketplace
    Então devo encontrar "Frete grátis!" no marketplace

  @carrinho @negative
  Cenário: Recusar CEP curto na simulação de frete
    Dado que adicionei o porcelanato do catálogo ao carrinho
    E navego para "/cart" no marketplace
    Quando informo "123" no campo "Digite seu CEP" do marketplace
    E clico na ação "OK" do marketplace
    Então devo encontrar "CEP inválido" no marketplace

  @checkout
  Cenário: Acessar checkout a partir de carrinho com produto
    Dado que adicionei o porcelanato do catálogo ao carrinho
    E navego para "/cart" no marketplace
    Quando clico na ação "Finalizar pedido" do marketplace
    Então a rota atual deve conter "/checkout"

  @search
  Cenário: Consultar categoria de pisos
    Dado que navego para "/category/pisos" no marketplace
    Então devo encontrar "Porcelanato Polido Branco 60x60cm" no marketplace
