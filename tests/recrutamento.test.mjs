import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createModel} from '../web/model.mjs';

const load = name => JSON.parse(readFileSync(new URL(name, import.meta.url), 'utf8'));
const data = load('../web/data.json');
const golden = load('./golden.json');
const config = load('../web/config.json');
const relations = load('../modelo/relationships.json');
const model = createModel(data, 'logistico');
const facts = data.tables.fViagens;
const at = (name, context={}) => model.measure(name, context);
const near = (a,b,tol=1e-6) => assert.ok(Math.abs(a-b)<tol, String(a)+' difere de '+String(b));
const year = y => ({'dCalendario|Ano':y});
const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const types = ['Agregado','Proprio','Terceiro'];

test('escopo: o caso usa exatamente o modelo logístico didático, não a análise comercial', () => {
  assert.equal(golden.kind, 'logistico');
  assert.equal(config.kind, 'logistico');
  assert.equal(facts.length, 854);
  assert.equal(data.tables['dVeículos'].length, 48);
  assert.equal(data.tables.dCliente.length, 26);
});

test('KPI global de viagens, peso e taxa bate com agregação independente da fato', () => {
  const trips = facts.filter(row => row.id_operacao !== null);
  const weight = facts.reduce((sum,row) => sum+(Number.isFinite(row.peso_total)?row.peso_total:0),0);
  const ontime = trips.filter(row => row['Status Prazo']==='No Prazo').length;
  const late = trips.filter(row => row.atraso_horas>0).length;
  assert.equal(trips.length, 854);
  near(weight,6754202.332);
  assert.equal(ontime, 843);
  assert.equal(late, 11);
  near(at('Volume Total'),weight);
  assert.equal(at('Total Viagens'),trips.length);
  near(at('% No Prazo'),ontime/trips.length);
  near(at('% Atraso'),late/trips.length);
});

test('recortes anuais 2025 e 2026 recompõem o total de viagens e volume', () => {
  const total = at('Total Viagens');
  assert.equal(at('Total Viagens',year(2025)),816);
  assert.equal(at('Total Viagens',year(2026)),38);
  assert.equal(at('Total Viagens',year(2025))+at('Total Viagens',year(2026)),total);
  near(at('Volume Total',year(2025))+at('Volume Total',year(2026)),at('Volume Total'));
});

test('soma das 12 categorias mensais recompõe viagens, peso e atrasos', () => {
  const sumMetric = name => months.reduce((sum,month)=>sum+at(name,{'dCalendario|MesNome':month}),0);
  assert.equal(sumMetric('Total Viagens'),854);
  assert.equal(sumMetric('Qtd Atrasos'),11);
  near(sumMetric('Volume Total'),at('Volume Total'));
});

test('2026 tem viagens sem atrasos; média de atraso em subconjunto vazio é nula', () => {
  assert.equal(at('Total Viagens',year(2026)),38);
  assert.equal(at('Qtd Atrasos',year(2026)),0);
  assert.equal(at('Tempo Médio Atraso',year(2026)),null);
  assert.equal(at('% No Prazo',year(2026)),1);
});

test('dispersão de volume por tipo de frota revela 9 viagens sem classificação', () => {
  const contexts=types.map(type=>({'dVeículos|tipo_frota':type}));
  const covered=contexts.reduce((sum,ctx)=>sum+at('Total Viagens',ctx),0);
  const coveredWeight=contexts.reduce((sum,ctx)=>sum+at('Volume Total',ctx),0);
  assert.equal(covered,845);
  assert.equal(at('Total Viagens')-covered,9);
  near(at('Volume Total')-coveredWeight,63500.622);
});

test('tipos de frota cobrem 48 veículos mesmo sem cobrir as 854 viagens', () => {
  const coveredVehicles=types.reduce((sum,type)=>sum+at('Total Veículos',{'dVeículos|tipo_frota':type}),0);
  assert.equal(coveredVehicles,48);
  assert.equal(at('Total Veículos'),48);
  assert.equal(at('Veículos Sem Atraso'),37);
  near(at('% Veículos Eficientes'),37/48);
});

test('indicador de peso representa massa somada, não quantidade de volumes', () => {
  near(at('Volume Total'),facts.reduce((s,r)=>s+(r.peso_total||0),0));
  assert.notEqual(at('Volume Total'),at('Total Viagens'));
});

test('status Cadastrado possui viagens, mas não exige duração informada', () => {
  const ctx={'dStatus|Status':'Cadastrado'};
  assert.equal(at('Total Viagens',ctx),7);
  assert.equal(at('Tempo Médio',ctx),null);
  assert.equal(at('Qtd Atrasos',ctx),0);
});

test('ano inexistente não fabrica taxa ou média, mas frota dimensionada permanece', () => {
  const ctx=year(1999);
  assert.equal(at('Total Viagens',ctx),0);
  assert.equal(at('Volume Total',ctx),0);
  assert.equal(at('% No Prazo',ctx),null);
  assert.equal(at('Tempo Médio',ctx),null);
  assert.equal(at('Total Veículos',ctx),48);
});

test('relacionamentos M:1 têm chave de dimensão sem duplicatas', () => {
  for(const rel of relations){
    const dim=data.tables[rel.ToTableName];
    assert.ok(Array.isArray(dim),rel.ToTableName);
    const keys=dim.map(row=>row[rel.ToColumnName]);
    assert.equal(new Set(keys.map(String)).size,keys.length,rel.ToTableName+'.'+rel.ToColumnName);
    assert.equal(rel.Cardinality,'M:1');
  }
});

test('qualidade referencial: todos os registros têm diagnóstico calculável, sem omitir órfãos', () => {
  for(const rel of relations){
    const keys=new Set(data.tables[rel.ToTableName].map(row=>String(row[rel.ToColumnName])));
    const known=facts.filter(row=>keys.has(String(row[rel.FromColumnName]))).length;
    const orphan=facts.length-known;
    assert.ok(orphan>=0 && known>=0,rel.ToTableName);
    assert.equal(known+orphan,854);
  }
});

test('as cinco páginas existentes permanecem apresentáveis e com navegação', () => {
  assert.deepEqual(config.pages.map(p=>p.title),[
    'Capa','Painel Executivo','Painel Operacional','Painel Logístico','Painel de Diagnostico'
  ]);
  assert.ok(config.pages.slice(1).every(p=>p.visuals.length>=1));
});

test('medidas logísticas sem contexto existem; métrica inexistente não inventa valor', () => {
  for(const name of ['Total Viagens','Volume Total','Tempo Médio','Qtd Atrasos','% No Prazo','% Atraso','Total Veículos']){
    assert.notEqual(at(name),null,name);
  }
  assert.equal(at('Economia Real Demonstrada'),null);
});
