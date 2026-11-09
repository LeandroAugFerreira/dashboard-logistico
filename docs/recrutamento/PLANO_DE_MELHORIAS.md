# Logística e Frota — evolução priorizada para recrutamento BI

**Foco:** análise de dados, qualidade, modelagem, DAX e storytelling técnico. Não buscar mais dashboards sem robustez nos existentes.

| Ordem | Melhorias | Impacto para recrutadores | Esforço | Risco | Critério de aceite |
| --- | --- | --- | --- | --- | --- |
| P0 | Reconciliação adicional de totais, períodos e frota | Forte | Baixo | Baixo | CI passa 39 testes |
| P0 | Diagnóstico automatizado das 5 relações | Forte | Baixo | Baixo | Relatório agregado com 8/9 chaves não encontradas |
| P0 | Estudo técnico com regras, DAX e limites | Forte | Baixo | Baixo | Documentos e roteiro de entrevista verificáveis |
| P0 | Guia visual com link para dashboard completo | Médio/alto | Baixo/médio | Baixo | Navegável sem login e sem backend |
| P1 | Sanear chaves de veículo e rota na origem ou classificar “Sem correspondência” | **Muito alto** | Médio | Médio | Recortes fecham com total, sem exclusão silenciosa |
| P1 | Dicionário de KPIs com unidades e definições aprovadas | Alto | Baixo | Baixo | “Volume Total” explicitamente peso, “Veículos” estoque de cadastro |
| P1 | Instrumentar teste de acessibilidade/navegação com Playwright | Médio/alto | Médio | Baixo/médio | CI e capturas com dados didáticos |
| P1 | Separar comparações de anos completos e parciais | Alto | Médio | Médio | Filtro de período com aviso de cobertura |
| P1 | DAX vs JavaScript: matriz de equivalência por contexto e teste de blanks | Alto | Alto | Médio | Amostra ampliada com Power BI Desktop/extrator autorizado |
| P2 | Pipeline de refresh controlado e verificação de schema | Alto | Alto | Médio/alto | Versões de snapshot, hashes e aprovação de publicação |
| P2 | Parametrizar caminhos Power Query de arquivo local | Médio | Médio | Médio | PBIX reabre sem paths pessoais fixos |
| P2 | Melhorar legibilidade de árvore de decomposição e mapas | Médio | Médio | Baixo | Navegação acessível, categorias não mapeadas visíveis |
| P3 | SQL de preparação auditável em base sintética e documentação de modelagem | Forte para vagas SQL | Médio/alto | Baixo | Consultas SQL reproduzem KPI e qualidade, com testes |
| P3 | Métricas de negócio adicionais (km, custo, eficiência, SLA) | Condicional | Alto | Alto | Fonte e definição reais/didáticas validadas antes |

## O que foi efetivamente feito neste ciclo

- 14 novos testes Node para modelo web e dados; total de 39 aprovados no [CI #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379).
- Script de qualidade publica **somente agregados** e preserva os originais.
- Sem alteração de fato, dimensões, DAX, XLSX, PBIX ou layout existente.
- Guia público de leitura proposto/ligado ao dashboard web completo, que já funciona.
- Hipóteses de saneamento **não foram implementadas** sem validação da fonte original.

## Priorização para o currículo

Primeiro comunicar controle de indicadores e **descoberta de dados não classificados**. Depois demonstrar que o modelo e os resultados são reproduzíveis com testes. Por fim, apontar próximos passos de ETL, Power Query e SQL para corrigir a origem.

Evitar afirmar melhoria de pontualidade de clientes, economia de transporte, implantações, contratos ou produtividade: o conjunto é didático.

[Qualidade dos dados](QUALIDADE_DADOS.md) · [Roteiro](ROTEIRO_DEMO.md).
