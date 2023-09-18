import { createWorker } from 'tesseract.js';
import $ from 'cash-dom';

export class HyReadLibraryCaptcha {

  async imageToText(dataURL: string): Promise<string> {
      const worker = await createWorker({
          langPath: 'https://crossorigin.me/https://powentan.github.io/hyread_chrome_extension',
      });
      await worker.loadLanguage('hyread-captcha');
      await worker.initialize('hyread-captcha');
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789',
      });
      const { data: { text } } = await worker.recognize(dataURL);
      console.log(text);

      return text;
  }

  getCanvasImageById(elementId: string) {
      const shift = 9;
      let canvasArray = [];
      let image: HTMLElement | null = null;
      while(image == null) {
        image = document.getElementById(elementId);
      }
      for(let i = 0; i < 6; i++) {
          let canvas: HTMLCanvasElement = document.createElement('canvas');
          let context: CanvasRenderingContext2D | null = canvas.getContext('2d');
          
          // Set canvas dimensions to match image dimensions
          let width = 13;
          // let height = image?.height;
          let height = image?.clientHeight || 0;
          canvas.width = width;
          canvas.height = height;
          
          // Draw the image onto the canvas
          let start = shift + i * width;
          if(context != null) {
            context.drawImage(image as CanvasImageSource, start, 0, width, height, 0, 0, width, height);
            canvas = this._removeBackgroundNoise(context, canvas);
            console.log(canvas.toDataURL('image/png'));
            canvasArray.push(canvas.toDataURL('image/png'));
          }
      }

      return canvasArray;
  }

  _removeBackgroundNoise(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Iterate over each pixel in the image
    for (let i = 0; i < data.length; i += 4) {
      // Perform noise reduction or thresholding operations
      // You can experiment with different techniques here

      // Example: Thresholding
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luminance = (r + g + b) / 3;
      const threshold = 128;
      const newValue = luminance > threshold ? 255 : 0;

      data[i] = newValue; // Red component
      data[i + 1] = newValue; // Green component
      data[i + 2] = newValue; // Blue component
      // data[i + 3] is the alpha component, which determines transparency
    }

    // Put the modified image data back onto the canvas
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  async tryToFillCaptcha() {
      let canvasArray = this.getCanvasImageById('conImg');
      let captcha = '';
      for(let i = 0; i < 6; i++) {
          let res = await this.imageToText(canvasArray[i])
          captcha += res.trim();
      }
      console.log(captcha);
      $('#valid').val(captcha);
  }
};
