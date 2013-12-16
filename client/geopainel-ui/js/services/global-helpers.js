'use strict';

App.factory('globalHelpers', function ($rootScope, $timeout, $location, $filter, formErrors) {
  return {
    init : function () {
      $rootScope.routeIs = function (route) {
        return $location.path() == route;
      };

      $rootScope.routeEndsWith = function (route) {
        return $location.path().indexOf(route, this.length - route.length) !== -1;
      };

      $rootScope.routeStartsWith = function (route) {
        return $location.path().indexOf(route, this.length - route.length) === 0;
      };

      $rootScope.processErrors = function(formController) {
        return formErrors.extractAndTranslateErrors(formController);
      };

      $rootScope.select2TransformData = function(remoteData, idField, textField) {
        var results = [];
        if (remoteData && remoteData.length > 0) {
          for (var i = 0; i < remoteData.length; i++) {
            results.push({'id': remoteData[i][idField], 'text': remoteData[i][textField]});
          };
        }
        return {'results': results};
      };

      $rootScope.select2FormatResult = function() {
        return function(result, container, query, escapeMarkup) {
          if (!result || !result.text || !query || !query.term) {
            return result.text || '';
          }

          var query = query.term.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
          query = query.replace(/a/ig, '[aáÁãÃàÀâÂäÄ]');
          query = query.replace(/e/ig, '[eéÉèÈêÊëË]');
          query = query.replace(/i/ig, '[iíÍìÌîÎïÏ]');
          query = query.replace(/o/ig, '[oóÓòÒôÔöÖõÕ]');
          query = query.replace(/u/ig, '[uúÚùÙûÛüÜ]');
          query = query.replace(/c/ig, '[cçÇ]');

          return result.text.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
            return '<span class="select2-match">' + match + '</span>';
          });
        };
      };

      $rootScope.matchIgnoreCaseAndAccent = function(term, text) {
        if (!term) {
          return text;
        }
        return $filter('removeAccents')(String(text)).indexOf($filter('removeAccents')(String(term))) >= 0;
      };

      $rootScope.select2Matcher = function(labelField) {
        return function(term, text, option) {
          var value = (text && labelField) ? text[labelField] : text;
          return $rootScope.matchIgnoreCaseAndAccent(term, value);
        };
      };

      $rootScope.resetForm = function(controller) {
        if (!controller.$name) {
          return;
        }

        var selector = 'form[name="' + controller.$name + '"]';
        $rootScope.resetFormControl(controller, $(selector));

        for (var i in controller) {
          if (!controller[i] || String(controller[i]).indexOf('$') == 0) {
            continue;
          }
          
          var control = controller[i];
          $rootScope.resetFormControl(control, ((!control.$name) ? null : $(selector + ' :input[name="' + control.$name + '"]')));
        };
      };

      $rootScope.resetFormControl = function(control, element) {
        control.$pristine = true;
        control.$dirty = false;

        if (element) {
          element.removeClass('ng-dirty').addClass('ng-pristine');
        }
      };

      $rootScope.timeoutCaller = function(action, timeout, next) {
        return function() {
          $timeout(function() {
            action();
            next && next();
          }, timeout);
        }
      };

      $rootScope.callWithTimeout = function(functions, timeout) {

        var actions = [];
        var previous = null;

        for (var i = 0; i < functions.length; i++) {
          var action = $rootScope.timeoutCaller(functions[i], timeout, previous);
          actions.push(action);
          previous = action;
        };
        
        actions[actions.length - 1]();
      };
    }
  };
});