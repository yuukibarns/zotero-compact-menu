import sys
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent
output = Path(sys.argv[1]).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for name in ('manifest.json', 'bootstrap.js'):
        archive.write(root / name, name)
print(output)
