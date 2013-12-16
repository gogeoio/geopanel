'use strict';

angular.module('filters', [])
  .filter('cut_string', function() {
    return function(text, length) {
      if (text && text.length > length) {
        return text.substr(0, length) + '...';
      }
      return text;
    }
  })
  .filter('capitalize', function () {
    return function (text) {
      if (!text) {
        return '';      
      }
      return text.toLowerCase().replace(/^.|\s\S/g, function(a) { 
        return a.toUpperCase(); 
      });
    };
  })
  .filter('startFrom', function() {
    return function(array, start) {
      if (!array) {
        return array;
      }
      return array.slice(Number(start));
    }
  })
  .filter('cnpj', function() {
    return function(value) {
      var cnpj = String(value).replace(/[^\d.]/g, '');
      cnpj = String(cnpj).replace(/\./g, '');

      var size = cnpj.length + 1;
      if (size == 15) {
       return cnpj.substr(0, 2) + '.' + cnpj.substr(2, 3) + '.' + cnpj.substr(5, 3) + '/' + cnpj.substr(8, 4)+ '-' + cnpj.substr(12, size - 12);
      }
      return cnpj;
    }
  });