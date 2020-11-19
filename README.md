#### Geo patterns for figma 

This is a figma plugin to add and customize some pattern used for geographic illustrations.

#### Getting started 
* [Plugin doc](https://www.figma.com/plugin-docs/intro/)
* [Bundling with webpack](https://www.figma.com/plugin-docs/bundling-webpack/)
* [webpack example](https://github.com/figma/plugin-samples/tree/master/webpack)
I tried to work with the webpack plugin 
#### Install dependencies
  `npm install`

#### How svg are used  

Under `tools` folder, the script `transform.js` loads all the svg files inside `tools/svg`, optimize them with  `svgo` and then extract all defined colors to be customized later. 

#### Build 

The plugin use webpack to bundle the code source, run `npm run webpack` to create dist files.

#### manifest.json

The `manifest.json` file defines the plugin name and the code (js/css) locations. so, here, we specify the main js file and the ui file. 

```
{
  "name": "YOU_PLUGIN_NAME",
  "id": "plugin_id_generated_by",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "dist/ui.html"
}
```

### Inline code in html 

I tried to build this plugin following the webpack tutorial from figma, but the inline plugin used to put css in the html didn't work. So I used this [inline plugin ](webpack/inline.plugin.js) from facebook [react-inline-plugin-tool](https://github.com/facebook/create-react-app/blob/master/packages/react-dev-utils/InlineChunkHtmlPlugin.js), i just copied the code to avoid installing all the package.
 

### Bundling with webpack 
I used parcel before switching to webpack but it was complicated to add all necessary plugins to parcel which is supposed to work in mode 'out-of-the-box' 

### Licence
[MIT](https://opensource.org/licenses/MIT)
