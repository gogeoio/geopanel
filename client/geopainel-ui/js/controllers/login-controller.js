'use strict';

App.controller('LoginController',
  function($scope, $rootScope, $http, $timeout, $location, services) {
    $scope.email = null;
    $scope.password = null;

    $scope.submit = function() {
      if ($scope.email && $scope.password) {
        var params = {
          email: $scope.email,
          password: $scope.password
        };
        
        services.login(params,
          function(data, status) {
            if (data && data.menus) {
              $rootScope.menus = data.menus;
            }

            if (data && data.user) {
              $rootScope.user = data.user;
            }

            $location.path("/companies");
          }
        );
      }
    }
  }
);