# Validação — 03/11/2026

Execução local com Node.js, sem instalar dependências da aplicação. **25 testes aprovados**; código de saída 0. Saída integral: [resultado-node.txt](resultado-node.txt).

Os testes conferem integridade das fontes e snapshot, identidades financeiras/logísticas, filtros e ausência de dados. A análise comercial também confere os valores da captura publicada em 2021. Os valores esperados comercial/logístico foram calculados independentemente em Python a partir das tabelas exportadas.

Hash SHA-256 de web/data.json: `88728e38ecfb802e3bdf2b0fc1cb21d9e53456f5e4baa5148019652b3871e623`.

As páginas foram inspecionadas no navegador local; seleções e navegação foram exercitadas. A comparação visual não certifica reprodução pixel a pixel do Power BI nem todos os estados possíveis de filtros. O workflow remoto será consultado em [Actions](https://github.com/LeandroAugFerreira/dashboard-logistico/actions).


---

## Verificação adicional — estudo de caso para recrutamento (08/11/2026)

[GitHub Actions #42538913379](https://github.com/LeandroAugFerreira/dashboard-logistico/actions/runs/42538913379) concluiu **39 testes Node aprovados (25 antigos + 14 novos)**, sem falhas, utilizando Node 22 e arquivos estáticos. Foram reconfirmados hashes dos originais, hash do snapshot e cálculos baseados em `tests/golden.json` (referências independentes anteriores).

O script [recruitment_audit.mjs](../scripts/recruitment_audit.mjs) gerou um relatório agregado (sem IDs/linhas) sobre 854 viagens: **8 sem relação com dRotas**, peso **90.387,460**; **9 sem relação com dVeículos**, peso **63.500,622**; nenhum registro sem correspondência nos relacionamentos de cliente, empresa ou status. As contagens de rotas e veículos **podem se sobrepor**. [Detalhes e hipóteses](recrutamento/QUALIDADE_DADOS.md).

Os três tipos de frota somam 845 viagens (145 Agregado + 383 Proprio + 317 Terceiro), não 854. O total 854 e o peso total 6.754.202,332 permanecem no snapshot. Os testes não executaram motor DAX, Power BI Desktop, navegador real ou atualização de dados, e não alteraram originais. [Evidências](recrutamento/EVIDENCIAS.md).
