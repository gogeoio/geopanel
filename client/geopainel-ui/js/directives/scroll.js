'use strict';

App.directive('whenScrolledDown', function() {
  return function($scope, $elm, $attr) {
    var raw = $elm[0];
    
    $elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        $scope.$apply($attr.whenScrolledDown);
      }
    });
  };
});

App.directive('whenScrolledUp', function() {
  return function($scope, $elm, $attr) {
    var raw = $elm[0];
    
    $elm.bind('scroll', function() {
      if (raw.scrollTop == 0) {
        $scope.$apply($attr.whenScrolledUp);
      }
    });
  };
});