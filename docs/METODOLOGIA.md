# Metodologia e preservação

Os arquivos em originais/ mantêm os bytes e hashes da origem. As tabelas do PBIX foram lidas sem atualização de fontes e sem recalcular colunas dependentes da data corrente. modelo/ contém medidas DAX, consultas Power Query e esquema reais extraídos. O layout e os fundos provêm do PBIX.

A implementação JavaScript cobre os indicadores visíveis. Os testes usam valores esperados calculados independentemente em Python, incluindo períodos sem dados. O snapshot integral tem contagens e hash; as fontes binárias têm SHA-256. Todas as tabelas exportadas são mantidas, incluindo calendários automáticos.

Referência do extrator: [PBIXRay](https://github.com/Hugoberry/pbixray), versão usada 0.15.5. Ele lê o modelo e não avalia DAX. A interface web tem cálculos próprios explícitos; as expressões DAX originais são fornecidas para revisão.

Mapas: [IBGE, API de malhas](https://servicodados.ibge.gov.br/api/docs/malhas?versao=3) e [Natural Earth](https://github.com/nvkelso/natural-earth-vector), arquivos locais consultados em 03/11/2026. As bolhas por UF/continente representam as mesmas categorias do modelo, sobre uma malha simplificada. Árvore de decomposição com navegação manual; não executa análises de IA do Power BI.

O snapshot inclui 854 viagens e 48 veículos. Volume Total é a soma de peso_total, conforme DAX, não a quantidade de volumes. O percentual no prazo usa Status Prazo / Total Viagens; a quantidade de atrasos usa atraso_horas >0. Os gráficos de top clientes/rotas mantêm o filtro TopN por Volume Total e a medida Rank declarada no eixo do layout original, sem reinterpretar silenciosamente o gráfico. Médias ignoram valores nulos.
