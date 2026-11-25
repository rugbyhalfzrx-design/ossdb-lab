from pathlib import Path
import base64
root=Path(__file__).resolve().parent
s=(root/'index.html').read_text()
s=s.replace('<link rel="manifest" href="manifest.webmanifest">','')
s=s.replace('<link rel="stylesheet" href="style.css">','<style>\n'+(root/'style.css').read_text()+'\n</style>')
for name in ['lessons.js','simulator.js','sql-practice.js','app.js']:
    source=(root/name).read_text().replace('</script','<\\/script')
    s=s.replace(f'<script src="{name}?v=2.3"></script>','<script>\n'+source+'\n</script>')
for name,mime in [('icon.svg','image/svg+xml'),('icon.png','image/png')]:
    data=base64.b64encode((root/name).read_bytes()).decode('ascii')
    s=s.replace(f'href="{name}"',f'href="data:{mime};base64,{data}"')
(root/'ossdb-lab.html').write_text(s)
