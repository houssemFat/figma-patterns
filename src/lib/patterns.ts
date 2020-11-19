export function createPattern(newBytes) {
  const image = figma.createImage(newBytes);

  // get selection
  let pageSelection = figma.currentPage.selection;
  if (!pageSelection.length) {
    alert('No shape selected');
    return false;
  }
  let newSelection = [];
  let node;
  for (let i = 0; i < pageSelection.length; i++) {
    // console.log(pageSelection[i]);
    node = pageSelection[i];
    // @ts-ignore
    if (node.fills) {
      // console.log('ok');
      node.fills = [{
        type: 'IMAGE',
        imageHash: image.hash,
        scaleMode: 'TILE'
      }]
    }
    // push to the new nodes
    newSelection.push(node);
  }
  // Create a new paint for the new image.
  figma.currentPage.selection = newSelection;
}
