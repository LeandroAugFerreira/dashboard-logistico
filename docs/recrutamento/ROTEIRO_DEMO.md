# Logística e Frota — roteiro de demonstração BI (3 minutos)

**Dados:** fictícios/didáticos, snapshot estático. **Objetivo:** explicar definições e qualidade de dados, não anunciar resultado comercial.

## 00:00–00:25 — Pergunta e fontes

Abrir [página do projeto no portfólio](https://leandroaugferreira.github.io/transporte.html).

Fala: “Este estudo de caso apresenta a análise de viagens e frota. Preservo o Power BI original, DAX, Power Query e dados de origem. Uma implementação web independente permite explorar os indicadores sem instalar Power BI.”

## 00:25–00:55 — Métricas básicas

Abrir [guia do estudo](https://leandroaugferreira.github.io/logistica-case.html) ou [dashboard web original](https://leandroaugferreira.github.io/dashboards/logistico/).

Fala: “Há 854 viagens didáticas. São 843 marcadas ‘No Prazo’, equivalendo a 98,71%. Há 11 atrasos pela regra de duração positiva, tempo médio de 58,8 horas e peso total de 6.754.202,332 unidades do campo peso_total.”

## 00:55–01:25 — Filtros temporais

Comparar 2025 (816 viagens, 11 atrasos) com 2026 (38 viagens, zero atraso) no guia ou no dashboard. Observação: “2026 contém menos viagens e pode ser parcial; os percentuais não provam melhora operacional.”

## 01:25–02:05 — Descoberta de qualidade

Mostrar [diagnóstico](QUALIDADE_DADOS.md): 9 viagens sem veículo correspondente, 8 sem rota correspondente. Os três tipos da dimensão somam **845**, não 854. Fala: “Verificar a soma de segmentos contra o total evitou mascarar registros fora das dimensões. O próximo passo é revisar origem, chaves e Power Query — não apagar fatos.”

## 02:05–02:35 — Tecnologia

Abrir [medidas DAX](../../modelo/dax_measures.json), [Power Query](../../modelo/power_query.json), [relacionamentos](../../modelo/relationships.json) e [modelo JS](../../web/model.mjs).

Fala: “O dashboard web é uma reprodução complementar com fórmulas JavaScript. Testes verificam seu resultado contra referências independentes; não executo DAX no navegador.”

## 02:35–03:00 — Prova e limites

Abrir [GitHub Actions #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379) e [EVIDENCIAS.md](EVIDENCIAS.md).

Fala: “Os 39 testes passaram, incluindo hashes dos originais e 14 novos testes de qualidade e reconciliação. O caso é didático e não mede melhorias reais, ganhos de frota ou atualização em tempo real.”

## Plano B

Se o dashboard remoto não carregar, abrir a captura já preservada e o arquivo de referências `tests/golden.json`. Não chamar a captura do PBIX de captura de testes novos. Não demonstrar SQL/Power BI Desktop como executados se não foram.

[Entrevista técnica](ENTREVISTA_TECNICA.md) · [Estudo de caso](ESTUDO_DE_CASO.md).
