In order to make svg manipulation easy to handle, all svg are collected in a .json file using the transform.js. The transformation process includes :
- SVG optimisation using [svgo](https://raw.githubusercontent.com/svg/svgo)
- Replace common colors by `css var` so we can change the color dynamically [TODO]
- collect all results into a json file   
