"use strict";
// inspired from https://raw.githubusercontent.com/svg/svgo/master/examples/test.js
var fs = require('fs'),
		path = require('path'),
		SVGO = require('svgo'),
		baseDir = process.cwd(),
		filesPath = path.resolve(baseDir, 'tools', 'svgs'),
		outputPath = path.resolve(baseDir, 'src', 'ui', 'ts'),
		svgo = new SVGO({
			plugins: [{
				cleanupAttrs: true,
			}, {
				removeDoctype: true,
			}, {
				removeXMLProcInst: true,
			}, {
				removeComments: true,
			}, {
				removeMetadata: true,
			}, {
				removeTitle: true,
			}, {
				removeDesc: true,
			}, {
				removeUselessDefs: true,
			}, {
				removeEditorsNSData: true,
			}, {
				removeEmptyAttrs: true,
			}, {
				removeHiddenElems: true,
			}, {
				removeEmptyText: true,
			}, {
				removeEmptyContainers: true,
			}, {
				removeViewBox: false,
			}, {
				cleanupEnableBackground: true,
			}, {
				convertStyleToAttrs: true,
			}, {
				convertColors: true,
			}, {
				convertPathData: true,
			}, {
				convertTransform: true,
			}, {
				removeUnknownsAndDefaults: true,
			}, {
				removeNonInheritableGroupAttrs: true,
			}, {
				removeUselessStrokeAndFill: true,
			}, {
				removeUnusedNS: true,
			}, {
				cleanupIDs: true,
			}, {
				cleanupNumericValues: true,
			}, {
				moveElemsAttrsToGroup: true,
			}, {
				moveGroupAttrsToElems: true,
			}, {
				collapseGroups: true,
			}, {
				removeRasterImages: false,
			}, {
				mergePaths: true,
			}, {
				convertShapeToPath: true,
			}, {
				sortAttrs: true,
			}, {
				removeDimensions: true,
			}/*, {
				removeAttrs: {attrs: '(stroke|fill)'},
			}*/]
		});

let strokeRegx = /stroke="(((?!").)*)"/g
let fillRegx = /fill="(((?!").)*)"/g
// future usage
//let strokeOpacityRegx = /stroke-opacity="(((?!").)*)"/g

let data = [];
let svgs = [];
let colors = [];

/**
 *
 * @param color
 * @returns {string}
 */
function defineColor(color) {
	// prevent recursive colors definition
	if (!color.startsWith(`var`)) {
		if (!colors[color]) {
			let name = `color-${Object.keys(colors).length}`;
			colors[color] = {
				name: name,
				value: color
			}
		}
		return `var(--${colors[color].name})`;
	}
	return color;
}

/**
 * Look for fill and stroke, and define color if not yet defined
 */
function findColorsInSvg(regx, svg) {
	let match, found, color;
	found = svg.match(regx);
	found && found.forEach((e) => {
		// reinit regx
		regx.lastIndex = 0;
		match = regx.exec(e);
		if (match) {
			color = match[1];
			// ignore none or url
			if (color !== "none" && color.indexOf('url') < 0) {
				console.log("replacing >> " + color);
				svg = svg.replace(new RegExp(color, 'g'), defineColor(color));
			}
		} else {
			console.log("not replacing >> " + e);
		}
	});
	return svg;

}

/**
 *
 * @param svg
 */

function replaceColors(svg) {
	svg = findColorsInSvg(strokeRegx, svg);
	svg = findColorsInSvg(fillRegx, svg);
	return svg;
}

// loop through directoryPath and callback function
fs.readdir(filesPath, function (err, files) {
	let svg;
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	files.forEach(function (file) {
		fs.readFile(path.join(filesPath, file), 'utf8', function (err, fileString) {
			if (err) {
				throw err;
			}
			svgo.optimize(fileString, {path: file}).then(function (result) {
				svg = result.data;
				console.log('####' + file);
				// stokes & fills replacement
				svg = replaceColors(svg);

				svgs.push({
					svg: svg
				})

				if (svgs.length === files.length) {
					writeFile();
				}
			});
		});
	});
});

function writeFile() {
	data = {
		svgs: svgs,
		colors:
				Object.values(colors)
	}
	fs.writeFile(path.join(outputPath, "all_svgs.json"), JSON.stringify(data), 'utf8', function (err, data) {
		if (err) {
			throw err;
		}
		console.log('end writing file');
	});
}
