//var _ = require('lodash');

//The value in JSON may contain only string, number, object, array, true, false or null
//
//SassScript supports eight data types:
//
//numbers (e.g. 1.2, 13, 10px)
//strings of text, with and without quotes (e.g. "foo", 'bar', baz)
//colors (e.g. blue, #04a3f9, rgba(255, 0, 0, 0.5))
//booleans (e.g. true, false)
//nulls (e.g. null)
//lists of values, separated by spaces or commas (e.g. 1.5em 1em 0 2em, Helvetica, Arial, sans-serif)
//maps from one value to another (e.g. (key1: value1, key2: value2))
//function references

var notQuotesPatterns = [
    /^(\d*\.)?\d+(px|mm|cm|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)$/gi,
    /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/gi,
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/gi,
    /^rgb\([\s\d+\,]+\)$/gi,
    /^rgba\([\s\d+\,\.]+\)$/gi,
    /^hsl\([\s\d+\,\.%]+\)$/gi,
    /^hsla\([\s\d+\,\.%]+\)$/gi
];

module.exports = function(data) {
	var scss = '';

    if (!data) {
    	return;
    }
    
    data = JSON.parse(data);

    function parseTree(data, indent, sub) {

    	var isArray = typeof data == "object" && Array.isArray(data);

    	if(sub) {scss += "("}

        var newIndent = indent + "  ";

        var following = false;
		for(var key in data) {
			var value = data[key];
            var type = typeof value;

            //is primitive value
			//
            if(type == "number" || type == "string" || type == "boolean" || value === null) {
                //is wrap quotes
                //
            	var isWrapQuotes = false;
            	if(type == "string") {
                    isWrapQuotes = true;
                    for(var i in notQuotesPatterns) {
                        notQuotesPatterns[i].lastIndex = 0;
                        if(notQuotesPatterns[i].test(value)) {
                            isWrapQuotes = false;
                            break;
                        }
					}
				}

				if(sub) {
                    scss += (following ? (isArray ? " " : ", ") : "") + (isArray ? "" : key + ": ") + (isWrapQuotes ? '"' + value + '"' : value);
				} else {
                    scss += "$" + key + ": " + (isWrapQuotes ? '"' + value + '"' : value) + "\r\n";
				}
			//is nested object or array
			//
            } else {
            	if(sub) {
                    scss += (following ? (isArray ? " " : ", ") : "") + (isArray ? "" : key + ": ");
				} else {
                    scss += "$" + key + ": ";
				}

                parseTree(value, newIndent, true);

                if(!sub) {scss += "\r\n"}
			}
            following = true;
		}

        if(sub) {scss += ")"}
    }

    parseTree(data, "", false);

	return scss.trim();
}