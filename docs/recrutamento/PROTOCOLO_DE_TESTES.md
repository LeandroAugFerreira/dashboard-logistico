# Protocolo seguro de verificação — dashboard logístico

## Testes executados

O [CI #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379) concluiu 39 casos de Node Test Runner, sem falhas, e diagnóstico automatizado de cobertura dos relacionamentos.

As 25 verificações anteriores incluem hashes SHA-256 do PBIX e XLSX originais, hash e linhas do snapshot, 21 contextos `golden` com referências independentes e filtros vazios. Os **14 testes novos** em [tests/recrutamento.test.mjs](../../tests/recrutamento.test.mjs) verificam composição por ano/mês, métricas brutas, campos sem duração, ausência de média, frota, qualidade de dimensões e páginas.

O script [scripts/recruitment_audit.mjs](../../scripts/recruitment_audit.mjs) confere cobertura das cinco relações extraídas. O resumo local é salvo em `reports/quality-summary.json`, ignorado pelo Git, e como artefato efêmero de CI. Não inclui chaves/placas/clientes/linhas de fato.

## Execução em cópia isolada

~~~sh
git clone https://github.com/LeandroAugFerreira/dashboard-logistico.git
cd dashboard-logistico
node --test tests/*.test.mjs
node scripts/recruitment_audit.mjs
python -m http.server 8000 --directory web
~~~

Abrir `http://localhost:8000`. Testes de Node.js usam apenas módulos padrão e arquivos do próprio repositório; não precisam de npm install nem de dados corporativos externos. O servidor Python serve arquivos locais para visualização — não executa ETL ou DAX.

## Proteções e limites

- Fontes `.pbix` e `.xlsx` originais permanecem somente leitura. O script não regrava tabelas.
- Fonte didática já autorizada pelo autor; mesmo assim, **não** usar dados empresariais próprios sem nova avaliação de privacidade.
- O script gera diagnósticos **agregados**. A investigação de chaves precisa ocorrer em cópia autorizada, sem publicar informações individuais.
- Nenhum Power BI Desktop, SQL, navegador automatizado ou atualização de dados foi executado nesta revisão.
- Os KPIs do motor JavaScript são validados em contextos escolhidos. **Não** certifica equivalência universal com DAX.

## Verificação manual recomendada

Abra o dashboard web, compare visão geral 854 viagens com os três tipos de frota (145, 383, 317), e observe os 9 registros faltantes. Isso é limitação referencial de dados, não efeito do dashboard. Valide também 2025+2026 e os 12 meses contra o total.

[Auditoria](AUDITORIA.md) · [Evidências](EVIDENCIAS.md).
