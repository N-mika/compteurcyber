import pngToIco from 'png-to-ico';
import fs from 'fs';

(async () => {
  const buf = await pngToIco('iconew.png');
  fs.writeFileSync('icon.ico', buf);
})();