"use strict";

var App = angular.module('geopanel', ['http-interceptor', 'string-utils', 'i18next', 'filters', '$strap.directives']);

App.config(function($routeProvider, $locationProvider) {

    $routeProvider
      .when('/users', {
          templateUrl: '/views/controllers/users.html'
        , controller: 'UsersController'
      })
      .when('/companies', {
          templateUrl: '/views/controllers/companies.html'
        , controller: 'CompaniesController'
      })
      .when('/map', {
          templateUrl: '/views/controllers/map.html'
        , controller: 'MapController'
      })
      .when('/map/:list', {
          templateUrl: '/views/controllers/map.html'
        , controller: 'MapController'
      })
      .when('/login', {
          templateUrl: '/views/controllers/login.html',
          controller: 'LoginController'
      })
      .otherwise({
         redirectTo: '/login'
      })
      ;
  })
  .run(function($rootScope, $filter, $location, i18n, globalHelpers) {

    i18n.init();
    globalHelpers.init();

    $rootScope.$on('event:http-error',
      function(event, error) {
        var message = 'Ocorreu um erro, tente novamente mais tarde.';
        if (error && error.data && error.data.message) {
          message = error.data.message;
          
        } else if (error && error.data) {
          message = error.data;
        }
        console.log('http-error ', error);
      }
    );

    $rootScope.$on('$routeChangeSuccess',
      function(scope, next, current) {
        $('.btn').tooltip('hide');

        // if (!$rootScope.user && next && next.$root && !next.$root.$route.controller !== 'LoginController') {
        //   console.log("scope", scope);
        //   console.log("current", current);
        //   console.log("next", next);
        //   $location.path("/login");
        // }
      }
    );
  });
