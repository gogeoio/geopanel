'use strict';

angular.module('i18next', [])
  .factory('i18n',  ['$rootScope', '$window', function($rootScope, $window) {
    var localize =
      {
        language : $window.navigator.userLanguage || $window.navigator.language,
        
        init : function() {
        },

        load : function(locale) {
          window.location = '/?setLng=' + locale;
        },
        
        get : function (value) {
          return $.i18n.translate(value);
        }
      };
      return localize;
  }
])
.filter('i18n', ['i18n', function (i18n) {
    return function (key) {
      return i18n.get(key);
    };
  }
]);
