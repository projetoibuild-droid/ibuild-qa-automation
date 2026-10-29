# language: pt
@commerce @search @regression
Funcionalidade: Busca de produtos no marketplace
  Como comprador
  Quero pesquisar produtos por nome ou SKU
  Para localizar rapidamente materiais para minha obra

  Esquema do Cenário: Buscar produtos do catálogo pelo nome
    Dado que navego para "/search?q=<consulta>" no marketplace
    Então devo encontrar "<produto>" no marketplace
    Exemplos:
      | consulta      | produto                                |
      | Porcelanato   | Porcelanato Polido Branco 60x60cm      |
      | Rejunte       | Rejunte Cinza Platina 1kg              |
      | Laminado      | Piso Laminado Madeira Natural 1,21m²   |
      | Selador       | Selador Acrílico 18L                   |
      | Grafiato      | Textura Grafiato Areia 25kg            |

  @negative
  Cenário: Busca sem resultados apresenta mensagem apropriada
    Dado que navego para "/search?q=produtoinexistenteqa987" no marketplace
    Então devo encontrar "Nenhum produto encontrado" no marketplace
