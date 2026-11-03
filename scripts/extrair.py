"""Optional offline extraction. Tool dependency: pbixray==0.15.5; not a web runtime dependency."""
from pathlib import Path
import json,hashlib
import pandas as pd
from pbixray import PBIXRay
ROOT=Path(__file__).resolve().parents[1]
source=next((ROOT/'originais').glob('*.pbix'))
before=hashlib.sha256(source.read_bytes()).hexdigest()
model=PBIXRay(str(source))
def scalar(value):
    if hasattr(value,'isoformat'):return value.isoformat()
    if hasattr(value,'item'):return value.item()
    raise TypeError(type(value).__name__)
tables={}
for name in model.tables:
    df=model.get_table(name)
    tables[name]=df.astype(object).where(pd.notna(df),None).to_dict(orient='records')
(ROOT/'web/data.json').write_text(json.dumps({'tables':tables},ensure_ascii=False,separators=(',',':'),default=scalar,allow_nan=False),encoding='utf-8')
assert hashlib.sha256(source.read_bytes()).hexdigest()==before
print('Snapshot extraído; PBIX inalterado. Revise e atualize as evidências de integridade antes de publicar.')
