'use strict';

App.factory('services', function ($rootScope, $http) {
  return {
    url : function (path) {
      var url = "http://localhost:8080/" + path + "?";
      return url;
    },

    getSession: function(callback) {
      $http.get(this.url('account/session'))
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
    }
  };
});
