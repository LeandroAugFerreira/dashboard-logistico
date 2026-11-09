# Logística e Frota — estudo de caso técnico para Dados e BI

## Contexto e pergunta de negócio

Como acompanhar **pontualidade, viagens, peso transportado e tempo de execução** por período, cliente, rota e frota, sem confundir métricas distintas? Como demonstrar que as agregações não ocultam registros sem correspondência nas dimensões?

O cenário usa bases **fictícias/didáticas autorizadas pelo autor** e não representa monitoramento ou melhoria comprovada de uma transportadora.

## Fontes e arquitetura

O Power BI original (.pbix) e planilhas didáticas (.xlsx) foram preservados e possuem hashes em [originais/SHA256.json](../../originais/SHA256.json). As consultas Power Query, medidas DAX, colunas, esquema, relacionamentos e layout estão em [modelo](../../modelo).

O snapshot [web/data.json](../../web/data.json), extraído offline em preparação anterior, alimenta uma aplicação HTML/SVG/JavaScript que implementa **cálculos próprios de apresentação**, com filtros dinâmicos. Ele não faz refresh, não executa DAX e não usa backend.

[Diagrama completo](ARQUITETURA.md).

## Questões analíticas e resultados

### 1. Qual o desempenho geral deste conjunto didático?

- **854 viagens** registradas.
- **843 no prazo**, definidas pelo campo de status; **98,71%** de taxa de pontualidade.
- **11 viagens com atraso positivo**, ou 1,29% da base.
- **58,80 h** de tempo médio de execução, ignorando valores nulos.
- **6.754.202,332 unidades de peso** na soma do campo `peso_total`. O nome “Volume Total” é a nomenclatura da medida, **não** contagem de volumes.

### 2. O que muda por ano?

| Período do conjunto didático | Viagens | Peso total | Atrasos | Pontualidade | Tempo médio |
| --- | ---: | ---: | ---: | ---: | ---: |
| 2025 | 816 | 6.518.816,974 | 11 | 98,65% | 59,69 h |
| 2026 | 38 | 235.385,358 | 0 | 100,00% | 37,85 h |
| Total | 854 | 6.754.202,332 | 11 | 98,71% | 58,80 h |

**Não concluir que “o SLA melhorou em 2026” por si só:** o período tem apenas 38 viagens no snapshot e pode ser incompleto. Não há análise de significância, sazonalidade nem exposição comparável.

### 3. O que a qualidade referencial revela?

As dimensões de **rotas (8 viagens)** e **veículos (9 viagens)** não cobrem completamente as chaves presentes em `fViagens`. O peso sem correspondência é 90.387,460 na dimensão rota e 63.500,622 na dimensão veículo. A soma por três tipos de frota é 845, não 854, embora a dimensão contenha os 48 veículos.

Isso altera a interpretação de ranking por rota/tipo de frota: uma visualização filtrada pode ocultar até esses registros. Não se devem inventar suas rotas/veículos nem removê-los da fato para “fechar” o gráfico.

[Diagnóstico e hipóteses a validar](QUALIDADE_DADOS.md).

### 4. Quais decisões analíticas são apropriadas?

- Mostrar métricas com **numerador, denominador, unidade e período**.
- Preservar o total geral e exibir “Sem correspondência” nos recortes de rota/frota até investigar a fonte.
- Diferenciar viagens atrasadas (`atraso_horas > 0`) de categoria de prazo `Status Prazo` e testar sua consistência.
- Usar filtros de tempo com cuidado: “48 veículos” é contagem de cadastro dimensional, **não** frota que rodou no mês.
- Comparar 2025 e 2026 apenas dentro deste dataset didático, sem conclusão causal.

## Solução entregue e comprovação

O projeto preserva os originais e disponibiliza [dashboard web interativo já funcional](https://leandroaugferreira.github.io/dashboards/logistico/) e [página do portfólio](https://leandroaugferreira.github.io/transporte.html). O CI verifica hashes dos originais, snapshot, contagens e reconciliações; novos testes cobrem partições de anos, meses, tipos de frota, KPIs e qualidade.

[39 testes aprovados](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379). Sem atualização das fontes nesta etapa.

## Limites

Não existem evidências de clientes, faturamento, economia de frete, aumento real de produtividade ou implantação de BI. A versão web é uma implementação derivada, não Power BI Embedded. O Power BI Desktop não foi executado nesta revisão, e a tela publicada não recebeu novos dados de produção.

## Para uma entrevista

Apresente primeiro a pergunta de negócio e as definições dos KPIs; depois abra o dashboard, mostre um filtro por ano e explique por que o total por tipo de frota não fecha. Mostre as DAX e o teste automatizado que verificou a reconciliação. Feche com hipóteses de saneamento e implicações de decisão, não com promessa de ganho comercial.

[15 perguntas técnicas](ENTREVISTA_TECNICA.md) · [Roteiro de 3 minutos](ROTEIRO_DEMO.md).
