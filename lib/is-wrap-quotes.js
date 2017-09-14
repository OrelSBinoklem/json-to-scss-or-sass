'use strict';

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

const notQuotesPatterns = [
    /^(\d*\.)?\d+(px|mm|cm|pt|pc|em|ex|ch|rem|%|vw|vh|vmin|vmax)$/gi,
    /^(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)$/gi,
    /^#([0-9a-f]{3}|[0-9a-f]{6})$/gi,
    /^rgb\([\s\d+\,]+\)$/gi,
    /^rgba\([\s\d+\,\.]+\)$/gi,
    /^hsl\([\s\d+\,\.%]+\)$/gi,
    /^hsla\([\s\d+\,\.%]+\)$/gi
];

module.exports = function(value, stringsNotQuotes) {
    var isWrapQuotes = false;
    if(typeof value == "string") {
        isWrapQuotes = true;
        for(var i in notQuotesPatterns) {
            notQuotesPatterns[i].lastIndex = 0;
            if(notQuotesPatterns[i].test(value)) {
                isWrapQuotes = false;
                break;
            }
        }

        if(isWrapQuotes && stringsNotQuotes) {
            for(var i in stringsNotQuotes) {
                var pattern = stringsNotQuotes[i];
                if(typeof pattern == "string") {
                    if(pattern == value) {
                        isWrapQuotes = false;
                        break;
                    }
                } else {
                    pattern.lastIndex = 0;
                    if(pattern.test(value)) {
                        isWrapQuotes = false;
                        break;
                    }
                }
            }
        }
    }

    return isWrapQuotes;
};