'use strict';

App.controller('CompaniesController', function($scope, $rootScope, $location, $timeout, $filter, services, i18n, formErrors) {

  $scope.isLoading = false;
  $scope.showNoListsWarning = false;

  $scope.activateTooltip = function() {
    $('[data-toggle=tooltip]').tooltip({ delay: { show: 700 }, container: 'body'});
  };

  $scope.processListResult = function(result, hasFilter) {
    $scope.rows = result.rows;
    $scope.lastLoadedCount = ($scope.rows) ? $scope.rows.length : 0;

    if (hasFilter) {
      $scope.filterCount = result.total;
    } else {
      $scope.totalCount = result.total;
    }

  };

  $scope.loadPage = function(page) {
    if (_.isUndefined(page) || _.isNull(page)) {
      page = $scope.currentPage;
    }
    $scope.loadListData(page, false, $scope.searchValue);
  };

  $scope.clearFilter = function() {
    $scope.clearFilters();
    $scope.hasFilter = false;
    $scope.isFilter = false;
    $scope.loadPage();
  };

  $scope.clickFilter = function() {

    var filter = $scope.getFilters();

    if (filter.location || filter.cnae) {
      $scope.hasFilter = true;
      $scope.searchValue = null;
    } else {
      $scope.hasFilter = false;
    }

    $timeout(function() {
        $scope.currentPage = 0;
        $scope.loadListData($scope.currentPage, true, '');
        $scope.isFilter = true;
        $scope.collapseFiltering = true;
    });
  };

  $scope.selectList = function(index) {
    if (!index) {
      index = 0;
    }

    $scope.selected = $scope.lists[index];
    $('#company-choose').select2('data', {'id': $scope.selected.id, 'text': $scope.selected.collection_name});
  }

  $scope.loadListData = function(page, updateFilter, searchValue) {

    if (!$scope.selected) {
      $scope.selectList(0);
    }

    $scope.listName = $scope.selected.collection_name;
    $scope.currentPage = page;
    $scope.searchValue = searchValue;

    if (updateFilter) {
      $scope.hasFilter = false;
      $scope.setFilters($scope.getFilters());
    }

    var params = $scope.getFilters();
    params['page'] = (page + 1);

    $scope.isLoading = true;

    services.listData($scope.selected.id, params, function(result) {
      $scope.isLoading = false;
      $scope.processListResult(result, updateFilter);
    });
  };

  $scope.clearSearch = function() {
    $timeout(function() {
      $scope.searchValue = '';
      $scope.clickFilter();
    });
  };

  $scope.getFilters = function() {
    return {
      'location': $('#location-cmp-choose').val(),
      'cnae': $('#cnae-cmp-choose').val()
    };
  };

  $scope.clearFilters = function() {
    $('#location-cmp-choose').val('');
    $('#cnae-cmp-choose').val('');
  };

  $scope.setFilters = function(filter) {
    if (filter) {
      $('#location-cmp-choose').val(filter['location']);
      $('#cnae-cmp-choose').val(filter['cnae']);
    }
  };

  $scope.getCompanyListData = function() {
    var results = [];

    if ($scope.lists && $scope.lists.length > 0) {
      for (var i = 0; i < $scope.lists.length; i++) {
        var id = $scope.lists[i].id;
        var text = $scope.lists[i].collection_name;

        results.push({'id': id, 'text': text});
      };
    }

    return results;
  };

  $scope.configureListsChoose = function() {
    $('#company-choose').select2({
        width: '150px'
      , matcher: $rootScope.select2Matcher()
      , formatResult: $rootScope.select2FormatResult()
      , data: $scope.getCompanyListData()
    });

    $('#company-choose').on('change', function() {
      var selected = $('#company-choose').select2('data');
      if (selected) {
        $timeout(function() {
          $scope.selected = $scope.getListById(selected.id);
          $scope.loadListData(0, false, $scope.searchValue);
        });
      }
    });
  };

  $scope.getListById = function(id) {
    var list = null;
    for (var i = 0; i < $scope.lists.length; i++) {
      if ($scope.lists[i].id === id) {
        list = $scope.lists[i];
        break;
      }
    }
  return list;
  }

  $scope.getLists = function() {
    services.lists(function(result) {
      $scope.lists = result.rows;

      if (!$scope.lists || $scope.lists.length == 0) {
        $scope.showNoListsWarning = true;
        return;
      }

      $scope.configureListsChoose();
      $timeout(function() {
        $scope.selectList(0);
        $scope.loadListData(0, false, $scope.searchValue);
      }, 200);
    });
  };

  $scope.configure = function() {
    if (!$scope.companyControllerInitialized) {
      $scope.companyControllerInitialized = true;
      $scope.activateTooltip();
    };

    $scope.isAdmin = true;
    $scope.collapseFiltering = true;

    $scope.limit = 10;
    $scope.lastLoadedCount = 0;

    $scope.getLists();
  };

  $timeout(function() {
    $scope.configure();
  });
});
