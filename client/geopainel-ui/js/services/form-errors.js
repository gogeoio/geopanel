'use strict';

App.factory('formErrors', function (i18n) {

  return {

    extractErrors : function (formController) {
      
      var object = {};

      for (var name in formController.$error) {
        var error = formController.$error[name];
        for (var i = 0; i < error.length; i++) {

          if (!object[error[i].$name]) {
            object[error[i].$name] = [];
          }
          object[error[i].$name].push(name);
        }
      }
      var forms = {};
      forms[formController.$name] = object;
      return forms;
    },

    translateErrors : function (forms) {
      
      var result = [];

      for (var formName in forms) {
        var fields = forms[formName];
        for (var field in fields) {
          var errorArray = fields[field]
          for (var i = 0; i < errorArray.length; i++) {
            var error = errorArray[i];
            result.push(i18n.get(formName + '.' + field + '.label') + ': ' + i18n.get(formName + '.' + field + '.' + error));
          }
        }
      }
      return result;
    },

    extractAndTranslateErrors : function (formController) {
      return this.translateErrors(this.extractErrors(formController));
    }

  };
});