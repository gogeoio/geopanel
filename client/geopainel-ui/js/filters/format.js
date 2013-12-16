"use strict";

App.filter('formatCnpj', function () {
  return function (text) {
    var result = null;
    if (text) {
      result = text.substring(0, 2) + '.' + text.substring(2, 5) + '.' + text.substring(5, 8) + '/' + text.substring(8, 12) + '-' + text.substring(12, 14);
    }
    return result || text;
  }
});
