# Roteiro visual de viagem — versão com imagens corrigidas

## Como abrir

1. Extraia o ZIP.
2. Abra o arquivo `index_standalone_imagens.html` no Chrome ou Edge.
3. Não precisa importar dados, não precisa abrir servidor local e não precisa mexer no JSON.

## O que foi corrigido

- O HTML agora é standalone: dados, layout e lógica ficam dentro do próprio arquivo.
- Removi os links genéricos/instáveis do Unsplash que estavam quebrando.
- Cada card tenta carregar várias fontes de imagem em sequência.
- Se uma fonte bloquear hotlink, o card tenta a próxima automaticamente.
- Para locais comerciais sem imagem livre estável, foi adicionado fallback de busca externa pelo nome exato do local.

## Observação

As imagens continuam dependendo de internet. Para uma versão 100% offline, o próximo passo é baixar as fotos para uma pasta `/imagens` e trocar os links externos por arquivos locais.
