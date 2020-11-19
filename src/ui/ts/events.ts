const canvas = <HTMLCanvasElement>document.getElementById('canvas_preview');

/**
 * Update the selected pattern preview into the canvas
 * @param colors
 * @param patternId
 */
export function updateSelectPattern(colors: Colors, patternId: string) {
  let el = document.getElementById(patternId);
  const image = new Image();
  let outerHTML = el.outerHTML;
  Object.keys(colors).forEach(name => {
    outerHTML = outerHTML.replace(new RegExp(`var\\(--${name}\\)`, 'g'), colors[name]);
  })
  //console.log(el);
  image.src = "data:image/svg+xml;utf8," + escape(outerHTML);
  image.onload = function () {
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    // Draw the image
    ctx.drawImage(image, 0, 0);
  }
}

/**
 * Convert canvas to Uint8Array blob
 * @param cb
 */
export function convert(cb: Function) {
  let tries = 0;

  function tryToBlob() {
    canvas.toBlob(blob => {
      if (blob) {
        const reader = new FileReader()
        // @ts-ignore
        reader.onload = () => cb(null, new Uint8Array(reader.result))
        reader.onerror = () => cb(new Error('Could not read from blob'))
        reader.readAsArrayBuffer(blob)
      } else {
        tries++;
        if (tries < 5) {
          setTimeout(tryToBlob, 500);
        } else {
          cb('error');
        }
      }
    })
  }

  tryToBlob();
}
