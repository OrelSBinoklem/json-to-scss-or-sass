Simple node module to convert json to sass or scss variables

## Install

```bash
$ npm i -S json-to-scss-or-sass
```

## Usage
```js
'use strict';
const file_stream = require('fs');
const jsonToSass = require('json-to-scss-or-sass').sass;
const jsonToScss = require('json-to-scss-or-sass').scss;

file_stream.readFile('variables.json', 'utf8', function(error, data) {
  var scss = jsonToScss(data);
  
  	if(scss !== undefined) {
  		file_stream.writeFile("src/sass/base/_variables.scss", scss, 'utf8');
  	}
});
```

## Options
####jsonToSass(jsonString, options)

####options.scssIndent
Type: String Default value: '  '

####options.notQuotes
Type: Array Default value: []

Array of strings and / or regular expressions that determine what values will be without double quotes

## Release Notes

| Release | Notes |
| --- | --- |
| 0.0.0 | Alpha release |

## Licence

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->