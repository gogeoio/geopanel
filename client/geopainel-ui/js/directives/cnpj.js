'use strict';

App.directive('cnpj', function($filter) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attr, ngModel) {
    	function fromUser(text) {
				return (text || '');
			}

			function toUser(text) {
				return $filter('cnpj')(text || '');
			}
			ngModel.$parsers.push(fromUser);
			ngModel.$formatters.push(toUser);
    }
  };
});