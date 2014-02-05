'use strict';

App.factory('services', function ($rootScope, $http, $location) {
  return {
    url : function (path) {
      if (path.slice(0, 1) !== "/") {
        path = "/" + path;
      }

      var protocol = $location.protocol();
      var host = $location.host();
      var port = $location.port();

      var basePath = protocol + '://' + host + ':' + port;

      var url = basePath + path + "?";
      console.log('url', url);

      return url;
    },

    getSession: function(callback) {
      $http.get(this.url('session'))
        .success(callback);
    },

    userLists: function(callback) {
      $http.get(this.url('company/lists'))
        .success(callback);
    },

    lists: function(callback) {
      $http.get(this.url('lists'))
        .success(callback);
    },
    
    listData: function(listId, params, callback) {
      $http({
          url: this.url('lists/' + listId), 
          method: 'GET',
          params: params
        })
        .success(callback);
    },

    mapListsSearch: function(collection_id, query, page, limit, callback) {
      var params = {
        'id': collection_id,
        'query': query,
        'page': page,
        'limit': limit
      };

      $http({
        url: this.url('maps/list/filter'),
        method: 'GET',
        params: params
      }).success(callback);
    },

    login: function(params, callback) {
      // $http({url: "/login",
      //     method: "POST",
      //     params: params
      // }).success(callback);

      $http.post(this.url('login'), params)
      .success(callback);
    },

    logout: function() {
      $http({
        url: this.url('logout'),
        method: 'GET'
      }).success(function() {
        $rootScope.user = null;
        $rootScope.menus = [];
        $location.path('/login');
      })
    }
  };
});
