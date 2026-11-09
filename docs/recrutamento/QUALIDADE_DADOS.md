# Diagnóstico de qualidade dos dados — Logística e Frota

**Conjunto:** didático, sem informações de operação empresarial real. **Data da revisão:** 08/11/2026. **Fonte de evidência:** [GitHub Actions #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379) e artefato agregado `logistica-integridade-agregada`.

## Diagnóstico reproduzível

O script [scripts/recruitment_audit.mjs](../../scripts/recruitment_audit.mjs) compara, para cada relacionamento M:1 ativo extraído do PBIX, o valor da chave na tabela de 854 viagens com as chaves da dimensão correspondente. Gera **somente contagens e soma de peso**, sem publicar IDs faltantes, placas, clientes ou linhas da fato. Os arquivos de origem continuam inalterados.

| Dimensão | Chave da fato | Linhas sem correspondência | Soma de peso sem correspondência | Tamanho dimensão |
| --- | --- | ---: | ---: | ---: |
| dCliente | id_cliente | 0 | 0 | 26 |
| dEmpresa | owner_id | 0 | 0 | 2 |
| dRotas | id_linha | **8** | **90.387,460** | 30 |
| dStatus | id_status | 0 | 0 | 4 |
| dVeículos | id_veiculo | **9** | **63.500,622** | 48 |

**Não somar 8 + 9 como número de viagens distintas.** Uma mesma linha pode ter duas relações inválidas; o script conta cada relação independentemente. Para diagnosticar sobreposição, investigar no ambiente autorizado com apenas agregações e chaves fictícias.

## Efeito comprovado na análise por tipo de frota

| Tipo registrado na dimensão | Viagens | Soma de peso |
| --- | ---: | ---: |
| Agregado | 145 | 1.015.862,867 |
| Próprio (grafado `Proprio` na base) | 383 | 3.057.108,330 |
| Terceiro | 317 | 2.617.730,513 |
| **Cobertas pelos três tipos** | **845** | **6.690.701,710** |
| **Fora do relacionamento com dVeículos** | **9** | **63.500,622** |
| **Total da fato** | **854** | **6.754.202,332** |

Assim, os três tipos de frota cobrem **98,95%** das viagens (845/854), mas não 100%. Um gráfico sem a categoria “Sem correspondência” pode ser enganoso. O número de veículos da dimensão soma 48 entre os três tipos; o problema não é uma quarta categoria de veículo reconhecida.

## Efeito no agrupamento por rota

Há 8 viagens com `id_linha` sem correspondência em `dRotas`, somando peso 90.387,460. Qualquer ranking ou mapa que dependa de `dRotas` pode excluir esses registros ou agregá-los como valor em branco, conforme o motor e as configurações. **Não é correto atribuir automaticamente uma rota a esses registros.**

## Hipóteses de causa, ainda não validadas

As chaves podem ser registros órfãos na fato, linhas ausentes nas dimensões, valores mal tipados, convenções de “sem cadastro”, ou uma transformação incompleta. O diagnóstico mede o resultado do snapshot publicado; não prova a origem do erro. Para identificar a causa: revisar Excel, Power Query, cardinalidade, formatos das chaves, linhas eliminadas, valores nulos e alterações do modelo original, usando uma cópia separada.

## Plano seguro de saneamento

1. **Preservar snapshots/binários e hashes** antes de mexer em fontes. Não “corrigir” apenas no gráfico ou apagar linhas da fato para satisfazer totais.
2. Medir cobertura por relação com logs agregados; isolar chaves sem correspondência em ambiente de análise restrito e com dados fictícios.
3. Revisar transformações Power Query/relacionamentos por valor e tipo; confirmar com fonte didática a regra de cadastro faltante.
4. Decidir se a saída é corrigir dimensões, adicionar membro “Não informado” explícito com chave controlada, ou manter uma categoria “Sem correspondência” em visuais. Documentar as escolhas.
5. Reexportar snapshot e recalcular **novas** referências esperadas somente após aprovação; comparar resultados antes/depois sem trocar métricas silenciosamente.
6. Adicionar regra de integridade no ETL para detectar futuros órfãos e dar visibilidade ao percentual coberto.

## Outras ressalvas analíticas

- `Volume Total` soma `peso_total`; a unidade específica precisa ser confirmada na fonte antes de rotular como kg/toneladas.
- `Total Veículos` é contagem de veículos cadastrados, não necessariamente ativos no período. Com filtro de ano sem viagens, a medida permanece 48.
- `% No Prazo` usa a categoria `Status Prazo` e `Qtd Atrasos` usa atraso positivo. Não assumir equivalência em dados futuros sem checar a regra.
- O conjunto de 2026 só contém 38 viagens; comparação com 816 em 2025 não significa mudança real de performance ou melhoria estatística.

## Reproduzir

```sh
node --test tests/*.test.mjs
node scripts/recruitment_audit.mjs
```

O script coloca apenas o resumo `reports/quality-summary.json` em caminho ignorado pelo Git. Ele não modifica `web/data.json`, PBIX ou XLSX.

[Auditoria](AUDITORIA.md) · [Estudo de caso](ESTUDO_DE_CASO.md) · [Plano](PLANO_DE_MELHORIAS.md).
