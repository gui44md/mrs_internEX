# Central de Monitoramento de Ativos — MRS Logística (protótipo)

Dashboard de portfólio inspirado na operação ferroviária da MRS Logística (corredor
MG → RJ → SP), simulando uma central de monitoramento de **20 subestações** de
energia/tração ao longo da malha.

> Projeto de portfólio com dados simulados, desenvolvido para se destacar em processo
> seletivo. Não representa dados reais da MRS Logística.

## O que o dashboard responde

**"Quais ativos precisam de atenção?"** — o painel principal calcula um *score de
risco* por subestação, combinando disponibilidade, MTTR, MTBF, número de alarmes
ativos e temperatura, e apresenta o ranking dos ativos mais críticos com o motivo
de cada alerta.

## Métricas por subestação

- Temperatura (°C)
- Consumo (MW)
- Status (Operacional / Atenção / Crítico / Manutenção)
- Alarmes ativos
- Disponibilidade (%)
- Número de falhas (últimos 90 dias)
- MTTR — tempo médio de reparo
- MTBF — tempo médio entre falhas

## Identidade visual

Paleta baseada nas cores oficiais da marca MRS Logística (azul prussiano `#00355B`,
amarelo tangerina `#FFCF00` e amarelo canário `#FFED00`), em um layout de "sala de
controle" escura, com o elemento de assinatura sendo um **mapa esquemático da linha
férrea**: as 20 subestações aparecem como estações ao longo do trilho, coloridas por
status, com alerta pulsante nos ativos que precisam de atenção.

Tipografia: Space Grotesk (display), IBM Plex Sans (texto) e JetBrains Mono (dados/leituras).

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`.

Para gerar a build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

```
src/
  data/substations.js     # gerador dos dados simulados das 20 subestações
  components/
    Header.jsx             # cabeçalho com identidade MRS
    KpiStrip.jsx            # indicadores agregados da frota
    RailLineMap.jsx         # mapa da linha férrea (elemento de assinatura)
    AttentionPanel.jsx      # ranking "quais ativos precisam de atenção"
    SubstationTable.jsx     # tabela completa com filtros por status
    DetailPanel.jsx         # detalhamento do ativo selecionado
  App.jsx
```

## Possíveis próximos passos

- Conectar a uma API real (ex.: histórico de leituras SCADA) em vez de dados mockados
- Adicionar gráfico de série histórica de temperatura/consumo por subestação
- Exportar relatório em PDF do ranking de atenção
- Autenticação e níveis de acesso (operador x gestor)
