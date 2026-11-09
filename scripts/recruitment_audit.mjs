// Diagnóstico agregado do snapshot didático para revisão de BI e entrevistas.
// Não exporta IDs, nomes, CPF, placa ou linhas de detalhe; só quantidades e peso.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const read=(name)=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const {tables}=read('web/data.json'),rels=read('modelo/relationships.json');
const golden=read('tests/golden.json');
const facts=tables.fViagens,weight=rows=>rows.reduce((s,r)=>s+(Number.isFinite(r.peso_total)?r.peso_total:0),0);
const relationships=rels.map(rel=>{
  const keys=new Set(tables[rel.ToTableName].map(row=>String(row[rel.ToColumnName])));
  const notMapped=facts.filter(row=>!keys.has(String(row[rel.FromColumnName])));
  return {
    dimension:rel.ToTableName,
    fact_key:rel.FromColumnName,
    dimension_key:rel.ToColumnName,
    total_rows:facts.length,
    without_match:notMapped.length,
    without_match_weight:Number(weight(notMapped).toFixed(3)),
    dimension_rows:tables[rel.ToTableName].length
  };
});
const summary={
  source:'Snapshot estático de bases didáticas autorizadas para publicação',
  refreshed_automatically:false,
  test_basis:golden.data_file_sha256,
  fact_rows:facts.length,
  volume_total:Number(weight(facts).toFixed(3)),
  late_trips:facts.filter(row=>row.atraso_horas>0).length,
  ontime_trips:facts.filter(row=>row['Status Prazo']==='No Prazo').length,
  relationships
};
mkdirSync(new URL('../reports/',import.meta.url),{recursive:true});
writeFileSync(new URL('../reports/quality-summary.json',import.meta.url),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
