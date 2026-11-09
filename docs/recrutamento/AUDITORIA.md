# Logística e Frota — auditoria técnica para recrutamento em Dados/BI

**Base inspecionada:** [main antes desta revisão](https://github.com/LeandroAugFerreira/dashboard-logistico/tree/2cb89946495fffc0f74bfc654f11ff4923c870f1), commit `2cb89946495fffc0f74bfc654f11ff4923c870f1` (08/11/2026). **Finalidade:** transformar o projeto em um case rastreável para Analista de Dados/BI Júnior. Não é auditoria operacional de frota nem homologação do Power BI Desktop.

## Parecer

É um **projeto didático de BI com modelo Power BI preservado**, medidas DAX, consultas Power Query e uma aplicação de apresentação web complementar em JavaScript/HTML/SVG. O mérito verificável está na modelagem, na reconciliação de indicadores e na identificação de inconsistências referenciais; não em alegar gestão de uma frota real.

A versão web é funcional no navegador e **não usa motor DAX**. Em vez disso, lê `web/data.json` estático e executa fórmulas próprias em [web/model.mjs](../../web/model.mjs). É importante não afirmar equivalência integral com todos os contextos DAX, visuais proprietários ou interações do PBIX.

## Materiais efetivamente examinados

- [README](../../README.md), [metodologia](../METODOLOGIA.md), [arquitetura](../ARQUITETURA.md), [segurança](../SEGURANCA.md).
- [modelo/dax_measures.json](../../modelo/dax_measures.json), [dax_columns.json](../../modelo/dax_columns.json), [power_query.json](../../modelo/power_query.json), [relationships.json](../../modelo/relationships.json), [schema.json](../../modelo/schema.json).
- [web/model.mjs](../../web/model.mjs), [app.mjs](../../web/app.mjs), [config.json](../../web/config.json), [data.json](../../web/data.json), [geography.json](../../web/geography.json).
- [tests/golden.json](../../tests/golden.json), [model.test.mjs](../../tests/model.test.mjs), novos [recrutamento.test.mjs](../../tests/recrutamento.test.mjs) e [recruitment_audit.mjs](../../scripts/recruitment_audit.mjs).
- [GitHub Actions](../../.github/workflows/tests.yml), hash dos arquivos Power BI/Excel em [SHA256.json](../../originais/SHA256.json). **Não foram editados os binários originais**.

O snapshot foi extraído em preparação anterior a partir de arquivos didáticos, com PBIXRay 0.15.5, conforme documentação existente. Nesta revisão **não houve reimportação do Excel, refresh do PBIX, alteração de Query, modelagem no Power BI Desktop nem regeneração do snapshot**.

## Fontes, dimensões e fatos

| Entidade | Registros publicados |
| --- | ---: |
| fViagens | 854 |
| dCalendario | 730 |
| dCliente | 26 |
| dEmpresa | 2 |
| dRotas | 30 |
| dStatus | 4 |
| dVeículos | 48 |
| dFaixaTempo | 6 |
| 01 - Medidas | 1 |

Os dados são **fictícios/didáticos**, conforme autorização já registrada pelo autor em 03/11/2026. Essas contagens não são indicadores de uma operação real ou crescimento de carteira.

## Medidas verificadas

- **Total Viagens:** `COUNT(fViagens[id_operacao])` — 854 viagens no recorte total.
- **Volume Total:** `SUM(fViagens[peso_total])` — 6.754.202,332 unidades **da coluna de peso**, e não número de embalagens ou pedidos.
- **Qtd Atrasos:** 11 registros com `atraso_horas > 0`.
- **% No Prazo:** 843/854 = **98,7119%**, segundo a coluna `Status Prazo`; não é necessariamente a mesma regra que atraso em todos os dados possíveis.
- **Tempo Médio:** 58,8016 horas, ignorando valores de duração não numéricos/nulos.
- **Total Veículos:** 48 registros da dimensão; seu valor **permanece 48 mesmo em um período sem viagens**, porque a medida não está definida como frota ativa naquele período.

As medidas originais em DAX foram confrontadas com a implementação JavaScript e com valores independentes congelados nos testes. É um teste de contextos selecionados, não equivalência universal de motores.

## Descoberta principal de qualidade referencial

Diagnóstico sobre todos os 854 registros:

| Relacionamento | Viagens sem correspondência | Peso associado |
| --- | ---: | ---: |
| fViagens → dCliente | 0 | 0 |
| fViagens → dEmpresa | 0 | 0 |
| fViagens → dRotas | **8** | **90.387,460** |
| fViagens → dStatus | 0 | 0 |
| fViagens → dVeículos | **9** | **63.500,622** |

Não sabemos, apenas por essas contagens agregadas, se faltam cadastros na dimensão, se houve referência incorreta na origem ou uma convenção de chaves. O diagnóstico não modifica dados nem inventa causa. **Esses conjuntos podem se sobrepor**, portanto não somá-los como 17 viagens distintas.

O recorte por `tipo_frota` cobre 845 viagens e 6.690.701,710 unidades de peso; o total permanece 854 / 6.754.202,332. Isso impede apresentar o somatório por tipo como 100% das viagens. O recorte por rota também requer grupo “sem correspondência” ou indicação de limitação.

Veja [QUALIDADE_DADOS.md](QUALIDADE_DADOS.md) para implicações e plano de saneamento.

## Outros limites técnicos

- A interface HTML/SVG implementa navegação, filtros, tabelas e alguns mapas/árvore de decomposição, **não** um Power BI Embedded com todos os visuais/DAX originais.
- O JSON local **não atualiza automaticamente**. Datas de 2025/2026 são períodos do dataset, não dados operacionais ao vivo.
- Originais PBIX/XLSX podem conter caminhos absolutos de importação Power Query, requerendo ajuste ao reproduzir em outro PC. Não reutilizar caminhos pessoais em tutoriais públicos.
- Medidas como “Volume Total” podem ser mal interpretadas por nomenclatura; a definição é peso. Conferir sempre a regra antes da conclusão.
- Não foi medida economia logística, aumento de SLA, queda real de atraso, acurácia de previsão, custo ou resultado financeiro.
- A revisão não reexecutou Power BI Desktop, não gerou PBIX novo e não adicionou funcionalidades ao dashboard web já publicado.

## Testes executados

[CI #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379): **39 testes aprovados** (25 preexistentes + 14 novos), validação de hashes e script que gera diagnóstico agregado sem exportar nomes, placas ou IDs. O workflow usa Node.js, não faz login em Power BI e não transfere dados a APIs.

## Apresentação profissional

“Desenvolvi/apresentei um case didático de BI de logística, com modelagem Power BI, medidas DAX, transformação Power Query e visualização web complementar. Reconciliei 854 viagens, 11 atrasos e indicadores de pontualidade; a análise de qualidade identificou 8 viagens sem correspondência na dimensão de rotas e 9 em veículos. Documentei impactos de recortes dimensionais e testes automatizados.”

**Só afirmar contribuições pessoais que possa explicar e demonstrar.** O case não reflete resultados comerciais de empresas.

[Estudo de caso](ESTUDO_DE_CASO.md) · [Arquitetura](ARQUITETURA.md) · [Evidências](EVIDENCIAS.md).
