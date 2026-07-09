# Roteiros Viagem

Projeto de planejamento de viagem unificado contendo os roteiros de Gramado e Barra do Garças.

## Estrutura
- `/index.html`: Página inicial para escolha do destino.
- `/shared/`: Contém os scripts e estilos compartilhados (`app.js`, `storage.js`, `utils.js`, `style.css`).
- `/trips/gramado/`: Roteiro específico de Gramado, com seus dados e configurações.
- `/trips/barra/`: Roteiro específico de Barra do Garças, com seus dados e configurações.

## Como Usar
Basta abrir o arquivo `index.html` na raiz do projeto (`roteiros-viagem/index.html`) no seu navegador (Google Chrome).
O projeto foi desenvolvido em HTML, CSS e JavaScript puros (Vanilla), e funciona diretamente no navegador sem precisar de servidor local.

## Funcionalidades
- **Catálogo:** Visualização em grade de todos os passeios.
- **Por Data:** Visualização de lista agrupada por data e ordenada por horário.
- **Kanban:** Quadro interativo com arrastar e soltar (drag and drop) para organizar os dias da viagem.
- **Filtros:** Busque por nome, cidade, data, faixa de preço, etc. O filtro de preço é cumulativo (ex: "Até R$ 100" inclui até R$ 50 e gratuitos).
- **LocalStorage:** Todas as suas edições (datas, notas, status, favoritos e ordem no Kanban) são salvas localmente no seu navegador. Os dados da viagem de Gramado são salvos separadamente dos de Barra do Garças.
- **Exportar / Importar:** Faça backup das suas alterações ou transfira para outro dispositivo exportando e importando o arquivo JSON gerado pelo sistema.

## Testes Realizados
✅ Abrir página inicial
✅ Navegar para ambos os roteiros
✅ Imagens carregam e possuem fallback caso a URL externa bloqueie ou a internet falhe
✅ Filtros funcionam corretamente (inclusive lógica cumulativa de preços)
✅ Modal permite edição de notas, datas, horário e status
✅ Kanban permite drag & drop com atualização automática da data no card
✅ Dados persistem no localStorage ao recarregar a aba
✅ Exportação e importação de JSON operacionais
