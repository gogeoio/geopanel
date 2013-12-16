'use strict';

App.directive('appMask', function($timeout) {
  return {
    restrict: 'A',
    require: "ngModel",
    link: function(scope, element, attrs, ngModel) {
      angular.element(element).mask(attrs.appMask, {
        'completed': function() {
          ngModel.$setViewValue(this.val());
          scope.$apply();
        }
      });
    }
  };
});