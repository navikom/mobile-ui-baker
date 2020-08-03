import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { MODE_DEVELOPMENT } from 'models/Constants';

class ZipGenerator {
  zip = new JSZip();

  svg2zip(path: string, content: string) {
    this.zip.file(`svg/${path}.svg`, content);
  }

  image2zip(path: string, content: Blob) {
    this.zip.file(`images/${path}.${content.type.split('/')[1]}`, content, { binary: true });
  }

  async generateZip(name: string) {
    try {
      const blob = await this.zip.generateAsync({ type: 'blob' });
      saveAs(blob, `${name} assets.zip`);
    } catch (err) {
      process.env.NODE_ENV === MODE_DEVELOPMENT && console.log('Generate Zip error: ', err);
    }
  }
}

export default ZipGenerator;
