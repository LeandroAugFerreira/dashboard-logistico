# Logística e Frota — evidências para recrutadores

**Data de referência:** 08/11/2026, base didática publicada. **Prova executada:** [GitHub Actions #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379), commit `5774f60ded6fe8c068a038954289b547333ad5b2`.

## Execução efetiva

- **39 testes Node.js aprovados, zero falhas**: 25 testes preexistentes de modelo, integridade e reconciliação + 14 novos em [recrutamento.test.mjs](../../tests/recrutamento.test.mjs).
- Verificados hashes SHA-256 dos originais PBIX/XLSX e do snapshot estático, e contagem de linhas por tabela.
- Cálculos web confrontados com referências `tests/golden.json` obtidas anteriormente de forma independente em Python. Esta revisão **não recalculou as referências** nem executou motor DAX.
- Script [recruitment_audit.mjs](../../scripts/recruitment_audit.mjs) **executado e concluído**, gerando artefato JSON agregado `logistica-integridade-agregada` (retenção curta). Zero dados individualizados no relatório; inclui somente totais e peso por relação.
- Nenhum pacote npm precisou ser instalado: Node.js 22 e módulos padrão.

## Resultados centrais observados

| Indicador didático | Resultado |
| --- | ---: |
| Viagens totais | 854 |
| Viagens 2025 | 816 |
| Viagens 2026 | 38 |
| Soma de `peso_total` | 6.754.202,332 |
| No prazo pelo status | 843 |
| Com atraso positivo | 11 |
| % No Prazo | 98,7119% |
| Tempo médio | 58,8016 h |
| Veículos na dimensão | 48 |
| dRotas sem correspondência | 8 viagens / peso 90.387,460 |
| dVeículos sem correspondência | 9 viagens / peso 63.500,622 |

## O que os 14 testes novos adicionam

- Reconciliação da tabela fato com contagens, peso, atrasos e pontualidade independentes.
- Anos 2025+2026 e 12 meses recompõem total e peso.
- Subconjunto de 2026 sem atrasos mantém média de atraso `null`.
- Tipo de frota cobre 845 viagens, sinalizando **9 não cobertas**, sem descartar a fato.
- Número de veículos somado por tipo é 48, e indicador de eficiência é 37/48 no contexto total.
- Medida “Volume Total” confirmada como soma de peso, não contagem.
- Status `Cadastrado` tem 7 viagens e média de duração ausente, sem transformar ausência em zero.
- Filtro para 1999 não inventa viagens, taxas ou média; cadastro de veículos permanece 48.
- Verificação de unicidade de chave do lado das dimensões M:1 e diagnóstico de cobertura de todas as cinco relações.
- Preservação das cinco páginas de relatório e uso explícito de medida inexistente como `null`.

**Detalhe importante:** os testes são reconciliações do **modelo JavaScript/snapshot** e de arquivos originais preservados, não execução do PBIX no Power BI Desktop. O número de 39 não significa 39 visuais homologados.

## Evidências anteriores, não repetidas nesta revisão

- [docs/VALIDACAO.md](../VALIDACAO.md): 25 testes locais e inspeção prévia de navegador.
- [Captura original do Power BI](../capturas/powerbi-referencia.png) preservada; não é screenshot novo do dashboard JavaScript.
- [README](../../README.md): confirmação anterior do autor de origem fictícia/didática e publicação autorizada.

## O que não foi executado

Power BI Desktop, atualização automática de fonte, DAX engine, ingestão externa, banco SQL, refresh incremental, testes de navegador novos ou comparação pixel a pixel. Não há análise de resultados comerciais, auditoria de uma operação real, economias ou metas de SLA atingidas por intervenção.

## Onde visualizar

O [dashboard web funcional](https://leandroaugferreira.github.io/dashboards/logistico/) já é público e interativo, com filtros. A [página do portfólio](https://leandroaugferreira.github.io/transporte.html) inclui o relatório e captura original. Um [guia de leitura do case](https://leandroaugferreira.github.io/logistica-case.html) destaca reconciliação, qualidade e limitações, sem substituir os gráficos.

[Auditoria](AUDITORIA.md) · [Qualidade](QUALIDADE_DADOS.md) · [Roteiro](ROTEIRO_DEMO.md).
