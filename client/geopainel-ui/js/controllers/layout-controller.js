'use strict';

App.controller('LayoutController', function($scope, $rootScope, $timeout, $location, services, i18n) {

  $scope.widthPage = "95%";
  $scope.sidebarOpened = false;

  $scope.toogleSidebar = function() {
    $scope.sidebarOpened = !$scope.sidebarOpened;
    
    if ($('#side-menu').hasClass('sidebar-closed') == true) {
      $scope.sidebarClass = 'sidebar-opened';
      $scope.widthPage = "85%";
    } else {
      $scope.sidebarClass = 'sidebar-closed';
      $scope.widthPage = "95%";
    }
  };

  $scope.logout = function() {
    services.logout();
  }

  var init = function() {
    $scope.sidebarClass = 'sidebar-opened';

    services.getSession(function(result) {
      if (_.isNull(result.user) || _.isUndefined(result.user) || _.isEmpty(result.user)) {
        $rootScope.menus = [];
        $rootScope.user = null;
        $location.path("/login");
      } else {
        if (result.menus) {
          $rootScope.menus = result.menus;
        }

        if (result.user) {
          $rootScope.user = result.user;
        }

        if (result.gogeoConfig) {
          $rootScope.gogeoConfig = result.gogeoConfig;
        }

        $location.path("/companies");
      }
    });
  };

  init();

  $timeout(function() {
    $scope.toogleSidebar();
  });
});
