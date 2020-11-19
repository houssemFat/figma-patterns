import './ui/style/ui.scss';

require('./ui/ts/init');
import { convert } from "./ui/ts/events";
// buttons for plugin
document.getElementById('create').onclick = () => {
  convert((err, data) => {
    if (!err) {
      parent.postMessage({
        pluginMessage: {
          type: 'create',
          info: {
            pattern: {
              data: data,
              options: {}
            },
          }
        }
      }, '*')
    } else {
      parent.postMessage({pluginMessage: {type: 'error'}}, '*')
    }
  })
}

document.getElementById('cancel').onclick = () => {
  parent.postMessage({pluginMessage: {type: 'cancel'}}, '*')
}
