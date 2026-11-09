# Logística e Frota — arquitetura e rastreabilidade

## Pipeline e componentes

~~~mermaid
flowchart LR
  ORIG[Planilhas XLSX didáticas preservadas] --> PQ[Consultas Power Query M do PBIX]
  PQ --> PBIX[Power BI: modelo e medidas DAX]
  PBIX --> EX[Extração offline PBIXRay 0.15.5 / preparação anterior]
  EX --> SNAP[web/data.json - snapshot versionado]
  EX --> META[modelo/ schema, relações, DAX e M]
  SNAP --> JS[web/model.mjs - agregações JS]
  META -.-> QA[Reconciliação e auditoria]
  JS --> UI[web/app.mjs - filtros e HTML/SVG]
  UI --> PAGE[Dashboard web estático GitHub Pages]
  SNAP --> QA
  GOLD[tests/golden.json - referências independentes] --> QA
  ORIG --> SHA[originais/SHA256.json]
  SHA --> QA
  QA --> ACTION[GitHub Actions: 39 testes e relatório agregado]
~~~

**Fonte e limites:** o PBIX original não foi atualizado nesta revisão. O extrator não calcula DAX; a UI usa lógica JavaScript própria. O relatório `quality-summary.json` guarda apenas contagens de chaves e pesos agregados.

## Modelo dimensional

~~~mermaid
erDiagram
  fViagens }o--o| dCliente: id_cliente
  fViagens }o--o| dEmpresa: owner_id
  fViagens }o--o| dRotas: id_linha
  fViagens }o--o| dStatus: id_status
  fViagens }o--o| dVeiculos: id_veiculo
  dCalendario ||--o{ fViagens: data_base
~~~

O desenho indica **relacionamentos conceituais** do uso em relatórios; o JSON original de relacionamentos registra cinco chaves ativas de fato para dimensões. O calendário é mapeado por data no modelo JavaScript; verificar a relação específica no PBIX antes de afirmar cardinalidade de um sexto relacionamento.

A cardinalidade do lado da fato é M:1 nas cinco relações extraídas, com direção única; na prática, há **chaves não encontradas em dRotas e dVeículos**. Cardinalidade declarada não implica integridade referencial completa.

## Medidas críticas do caso

| Medida | Regra de cálculo do modelo |
| --- | --- |
| Total Viagens | COUNT(fViagens[id_operacao]) |
| Volume Total | SUM(fViagens[peso_total]) |
| Qtd Atrasos | CONTAGEM onde atraso_horas é maior que zero |
| % No Prazo | COUNT de Status Prazo = No Prazo / Total Viagens |
| Tempo Médio | AVERAGE tempo_execucao_horas |
| Total Veículos | COUNTROWS dVeículos |

[Medidas DAX completas](../../modelo/dax_measures.json); [modelo JavaScript](../../web/model.mjs).

## Como testar

`node --test tests/*.test.mjs` valida integridade, referências e partições. `node scripts/recruitment_audit.mjs` gera diagnóstico agregado com cobertura de relações em diretório ignorado pelo Git. O CI publica apenas o artefato agregado de curta duração, sem IDs ou linhas de viagem.

[Qualidade dos dados](QUALIDADE_DADOS.md) · [Evidências](EVIDENCIAS.md).
