let svgsAndColors = require('./all_svgs.json');
import { updateSelectPattern } from "./events";

let colors = {};
let selectedPatternId;

function getColorsStyle() {
  return <HTMLStyleElement>document.getElementById('colors_style');
}

function createColorElement(e) {
  let elContainer, el;
  let colorsContainers = document.getElementById('colors_container');
  elContainer = document.createElement('div');
  elContainer.className = "color-item-container";
  el = document.createElement('input');
  el.type = "color";
  el.className = "color-item";
  el.value = e.value;
  el.dataset.color = e.name;
  // init colors key value
  colors[e.name] = e.value;
  elContainer.appendChild(el);
  elContainer.style.backgroundColor = `var(--${e.name})`;

  colorsContainers.appendChild(elContainer);
  elContainer.addEventListener('click', () => {
    el.click();
  })
  el.addEventListener('change', handleColorChange);
}

function appendColors() {
  let rootClass = "";
  svgsAndColors.colors.forEach(e => {
    // remove ref
    createColorElement(e);
    rootClass += `--${e.name}: ${e.value};`;
  });
  getColorsStyle().innerHTML = `:root { ${rootClass}  }`;
}

// append all svg inside the component
function appendSvgs() {
// append svgs
  let svgsContainer = document.getElementById('svgs_container');
  svgsAndColors.svgs.forEach((e, index) => {
    let svg = document.createElement('svg');
    svgsContainer.appendChild(svg);
    svg.outerHTML = e.svg.replace('<svg', `<svg id="pattern_${index}" `);
  })
  // attach click events
  let svgsElements = svgsContainer.querySelectorAll('svg');
  svgsElements.forEach(e => {
    e.addEventListener('click', (event) => {
      selectedPatternId = (<SVGElement>event.currentTarget).id;
      updateSelectPattern(colors, selectedPatternId);
    })
  });
}

function handleColorChange(event: Event) {
  let styleElm = getColorsStyle();
  // @see appendColors
  let targetColor = <HTMLInputElement>event.currentTarget;
  let name = targetColor.dataset.color;
  colors[name] = targetColor.value;
  styleElm.innerHTML = styleElm.innerHTML.replace(new RegExp(`--${name}:(((?!;).)*)`), `--${name}:${targetColor.value}`);
  if (selectedPatternId) {
    updateSelectPattern(colors, selectedPatternId);
  }
}

appendColors();
appendSvgs();
