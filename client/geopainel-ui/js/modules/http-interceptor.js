'use strict';

angular.module('http-interceptor', [])
  .provider('authService', function() {
    
    this.$get = ['$rootScope', function($rootScope) {
      return {
        loginConfirmed: function() {
          $rootScope.$broadcast('event:auth-logged');
        }
      }
    }]
  })
  .config(function($httpProvider, authServiceProvider) {
    
    var interceptor = ['$rootScope', '$q', function($rootScope, $q) {

      function success(response) {
        return response;
      }
 
      function error(response) {

        if (response.status === 401 && !(response.data && response.data.message)) {
          var deferred = $q.defer();
          $rootScope.$broadcast('event:auth-notLogged');
          return deferred.promise;
        }
        
        $rootScope.$broadcast('event:http-error', response);
        return $q.reject(response);
      }
 
      return function(promise) {
        return promise.then(success, error);
      }
 
    }];
    $httpProvider.responseInterceptors.push(interceptor);
  });