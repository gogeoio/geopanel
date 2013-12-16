'use strict';

angular.module('string-utils', []);

angular.module('string-utils').filter('capitalize', function () {
  return function (text) {

    if (!text) {
      return "";      
    }
    return text.toLowerCase().replace(/^.|\s\S/g, function(a) { 
      return a.toUpperCase(); 
    });

  };
});

angular.module('string-utils').filter('removeAccents', function () {

  return function (value) {

    if (!value) {
      return "";
    }
    var text = value.toLowerCase();
  
    text = text.replace(new RegExp("\\s", 'g'),"");
    text = text.replace(new RegExp("[àáâãäå]", 'g'),"a");
    text = text.replace(new RegExp("æ", 'g'),"ae");
    text = text.replace(new RegExp("ç", 'g'),"c");
    text = text.replace(new RegExp("[èéêë]", 'g'),"e");
    text = text.replace(new RegExp("[ìíîï]", 'g'),"i");
    text = text.replace(new RegExp("ñ", 'g'),"n");
    text = text.replace(new RegExp("[òóôõö]", 'g'),"o");
    text = text.replace(new RegExp("œ", 'g'),"oe");
    text = text.replace(new RegExp("[ùúûü]", 'g'),"u");
    text = text.replace(new RegExp("[ýÿ]", 'g'),"y");
    text = text.replace(new RegExp("\\W", 'g'),"");

    return text;
  };
});

angular.module('string-utils').filter('replaceString', function () {

  return function (text, pattern, replacement) {

    if (!text) {
      return "";
    }
    if (pattern && replacement) {
      return text.replace(pattern, replacement);
    }
    return text;
  };
});

angular.module('string-utils').filter('truncate', function () {
  return function (text, length, end) {

    if (!text) {
      return "";      
    }
    if (isNaN(length)) {
      length = 10;      
    }
    if (end === undefined) {
      end = "...";
    }
    if (text.length <= length || text.length - end.length <= length) {
      return text;
    } else {
      return String(text).substring(0, length-end.length) + end;
    }

  };
});
