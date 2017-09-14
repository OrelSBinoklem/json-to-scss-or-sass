'use strict';
const extend = require('extend');
const isWrapQuotesTest = require('./lib/is-wrap-quotes');

var defaultOptions = {
    scssIndent: "  "
};

module.exports = {
    sass: function(data, options) {
        if(!options) {
            options = {};
        }
        extend(options, defaultOptions);

        var sass = '';

        if (!data) {
            return;
        }

        data = JSON.parse(data);

        var parseTree = function(data, sub) {
            var isArray = typeof data == "object" && Array.isArray(data);
            var following = false;

            if(sub) {sass += "("}

            for(var key in data) {
                var value = data[key];
                var type = typeof value;

                //is primitive value
                //
                if(type == "number" || type == "string" || type == "boolean" || value === null) {
                    var isWrapQuotes = isWrapQuotesTest(value, options.notQuotes);

                    if(sub) {
                        sass += (following ? (isArray ? " " : ", ") : "") + (isArray ? "" : key + ": ") + (isWrapQuotes ? '"' + value + '"' : value);
                    } else {
                        sass += "$" + key + ": " + (isWrapQuotes ? '"' + value + '"' : value) + "\r\n";
                    }
                    //is nested object or array
                    //
                } else {
                    if(sub) {
                        sass += (following ? (isArray ? " " : ", ") : "") + (isArray ? "" : key + ": ");
                    } else {
                        sass += "$" + key + ": ";
                    }

                    parseTree(value, true);

                    if(!sub) {sass += "\r\n"}
                }
                following = true;
            }

            if(sub) {sass += ")"}
        }

        parseTree(data, false);

        return sass.trim();
    },
    scss: function(data, options) {
        if(!options) {
            options = {};
        }
        extend(options, defaultOptions);

        var scss = '';

        if (!data) {
            return;
        }

        data = JSON.parse(data);

        var parseTree = function(data, indent, sub) {
            var isArray = typeof data == "object" && Array.isArray(data);
            var following = false;
            var newIndent = sub ? indent + options.scssIndent : "";
            var allValuesPrimitive = true;
            var isEmpty = true;
            for(var key in data) {
                var value = data[key];
                var type = typeof value;
                isEmpty = false;
                if(!(type == "number" || type == "string" || type == "boolean" || value === null)) {
                    allValuesPrimitive = false;
                    break;
                }
            }

            if(sub) {scss += "(" + (allValuesPrimitive ? "" : "\r\n")}

            for(var key in data) {
                var value = data[key];
                var type = typeof value;

                //is primitive value
                //
                if(type == "number" || type == "string" || type == "boolean" || value === null) {
                    var isWrapQuotes = isWrapQuotesTest(value, options.notQuotes);

                    if(sub) {
                        scss += (following ? "," + (allValuesPrimitive ? " " : "\r\n") : "") + (allValuesPrimitive ? "" : newIndent) + (isArray ? "" : key + ": ") + (isWrapQuotes ? '"' + value + '"' : value);
                    } else {
                        scss += "$" + key + ": " + (isWrapQuotes ? '"' + value + '"' : value) + ";\r\n";
                    }
                    //is nested object or array
                    //
                } else {
                    if(sub) {
                        scss += (following ? ",\r\n" : "") + newIndent + (isArray ? "" : key + ": ");
                    } else {
                        scss += "$" + key + ": ";
                    }

                    parseTree(value, newIndent, true);

                    scss += sub ? "" : ";\r\n";
                }
                following = true;
            }

            if(sub) {scss += (allValuesPrimitive ? "" : "\r\n" + indent) + ")"}
        }

        parseTree(data, "", false);

        return scss.trim();
    }
};