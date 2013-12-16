'use strict';

App.directive('validate', function () {

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var validateFn, watch, validators = {},
        validateExpr = scope.$eval(attrs.validate);

      if (!validateExpr) {
        return;
      }
      if (angular.isString(validateExpr)) {
        var key = 'validator'

        if (attrs.validateKey) {
          key = String(attrs.validateKey);
        }
        var temp = {};
        temp[key] = validateExpr;
        validateExpr = temp;
      }

      angular.forEach(validateExpr, function (expression, key) {
        validateFn = function (valueToValidate) {
          if (scope.$eval(expression, { '$value' : valueToValidate })) {
            ctrl.$setValidity(key, true);
            return valueToValidate;
          } else {
            ctrl.$setValidity(key, false);
            return undefined;
          }
        };
        validators[key] = validateFn;
        ctrl.$formatters.push(validateFn);
        ctrl.$parsers.push(validateFn);
      });

      if (attrs.validateWatch) {
        watch = scope.$eval(attrs.validateWatch);
        if (angular.isString(watch)) {
          scope.$watch(watch, function(){
            angular.forEach(validators, function(validatorFn, key) {
              validatorFn(ctrl.$modelValue);
            });
          });
        } else {
          angular.forEach(watch, function(expression, key) {
            scope.$watch(expression, function() {
              validators[key](ctrl.$modelValue);
            });
          });
        }
      }
    }
  };
});