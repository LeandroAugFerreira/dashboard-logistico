# Logística e Frota — 15 perguntas técnicas para entrevista de Analista de Dados/BI

Respostas fundamentadas no PBIX/arquivos do repositório e nos testes. Não atribuir a si decisões ou experiências que não possa explicar. Dados inteiramente didáticos.

## 1. Qual a pergunta de negócio?
Como comparar volume de trabalho, pontualidade, horas de execução e atrasos por período, rota, cliente e tipo de frota, sem perder a visibilidade sobre linhas que não se relacionam às dimensões?

## 2. Que tecnologia compõe o projeto?
Power BI/PBIX, modelo com medidas DAX, consultas Power Query (M), arquivos de origem Excel, snapshot de tabelas exportado offline e interface HTML/JavaScript/SVG. **O dashboard web não executa DAX.** [Arquitetura](ARQUITETURA.md).

## 3. Qual a granularidade da tabela fato?
Registro de operação/viagem em `fViagens` com `id_operacao`, data, peso, duração e referências a cliente/rota/veículo/status/empresa. A contagem DAX usa `COUNT(fViagens[id_operacao])`. [DAX](../../modelo/dax_measures.json).

## 4. Qual a diferença entre Volume Total e Total Viagens?
Volume Total soma `peso_total` (= 6.754.202,332 unidades não confirmadas); Total Viagens conta operações (= 854). “Volume” não significa unidades físicas de caixas. **Estudar:** dicionário de métricas e unidade.

## 5. Como % No Prazo é calculado?
`COUNT(id_operacao)` para `Status Prazo = No Prazo` dividido por Total Viagens. São 843/854 = 98,71% no conjunto. `Qtd Atrasos` usa `atraso_horas>0` e deve ser monitorada separadamente. [DAX](../../modelo/dax_measures.json).

## 6. Por que não podemos comparar 2025 e 2026 como melhoria comprovada?
São 816 vs 38 viagens em um snapshot didático; 2026 pode ser período parcial. Sem equivalência de exposição e controle sazonal/estatístico, 100% em 2026 não demonstra ganho operacional.

## 7. O que significa Tempo Médio?
Média de `tempo_execucao_horas` com valores numéricos. Resultado total ~58,80 horas; para status Cadastrado a média é nula, não zero. **Estudar:** blanks no Power BI e `AVERAGE` vs zeros.

## 8. Como funciona o modelo de dados?
Uma fato de viagens e dimensões para cliente, empresa, rotas, status, veículos; cinco relações M:1 ativas de direção única, mais calendário usado na apresentação. [relationships.json](../../modelo/relationships.json).

## 9. O que descobriu sobre integridade referencial?
Há 8 registros sem correspondente em dRotas (peso 90.387,460) e 9 em dVeículos (peso 63.500,622). Os demais três relacionamentos analisados têm cobertura. Isso foi calculado automaticamente no CI. [Qualidade](QUALIDADE_DADOS.md).

## 10. Por que a soma por tipo de frota dá 845, não 854?
Os tipos Agregado, Proprio e Terceiro têm 145, 383, 317 viagens. A dimensão contém os 48 veículos; nove viagens não encontram `id_veiculo` correspondente e ficam fora da classificação. Não apagar as linhas da fato para forçar fechamento.

## 11. Como provar que o relatório web preserva os indicadores?
O `web/model.mjs` implementa fórmulas JS; o arquivo `tests/golden.json` guarda casos independentes; testes Node verificam medidas, hashes e partições. **Não afirmar equivalência total com DAX.** [Evidências](EVIDENCIAS.md).

## 12. Por que Total Veículos continua 48 ao selecionar um ano sem viagem?
É `COUNTROWS(dVeículos)`, cadastro dimensionado, não contagem de veículos operantes naquele período. Para “ativos”, criar outra medida de DISTINCTCOUNT de veículos da fato, se a pergunta exigir.

## 13. Como mediu a cobertura por dimensão sem expor dados?
Script Node compara chaves de fViagens a cada dimensão e gera **apenas** contagem e peso sem correspondência. Não publica IDs, placas, clientes, extratos ou linhas. [Script](../../scripts/recruitment_audit.mjs).

## 14. O que significam os 39 testes?
São reconciliações, integridade e comportamento do modelo web: 25 preexistentes + 14 novos. Não incluem teste de Power BI Desktop, refresh real, SQL, visuais pixel a pixel ou integração operacional. [CI](EVIDENCIAS.md).

## 15. Qual a próxima melhoria de maior valor?
Corrigir relacionamento/linhas ausentes com validação da fonte e mostrar “Sem correspondência” nos gráficos; criar documentação de unidade/semântica de KPIs, incluir testes de navegação e um plano de refresh seguro. **Estudar:** ETL, modelagem estrela, DAX CALCULATE/filter context, qualidade de dados.

---

## Exercício recomendado

Explique `854 viagens → 843 no prazo → 11 atrasadas`, abra a DAX, depois explique por que os tipos somam 845. Mostre os logs agregados do CI e proponha resolução **sem** alterar silenciosamente os valores originais.

Não invente vendas, lucros, metas atendidas, redução de custo, clientes operacionais ou implantação real.
