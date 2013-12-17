'use strict';

App.controller('MapController', function($scope, $rootScope, $http, $routeParams, $compile, $location, $timeout, $window, $filter, mapHelper, services) {

  $scope.showNoListsWarning = false;
  $scope.isLoading = false;
  $scope.displayList = $routeParams.list;

  $scope.config = {
    sortDir: 'asc',
    sortAttr: 'name',
    limit: 10,
    map: {
      host: "http://192.168.88.143:9090",
      dbname: "db1"
    },
    center: {
      longitude: -49.25933128592078,
      latitude: -16.670975386982306,
      zoom: 9
    }
  };

  $scope.init = function() {

    $scope.setupMap();
    $scope.balloonScope = $scope.$new();
    $scope.createBalloon();
    $scope.calculateListHeight();
    $scope.page = 1;

    services.userLists(function(lists) {
      $scope.company.list = lists;

      if (!lists || lists.length == 0) {
        $scope.showNoListsWarning = true;
      }

      $timeout( function() {
        $('#company-map-choose').select2({
            width: '100%'
          , matcher: $rootScope.select2Matcher()
          , formatResult: $rootScope.select2FormatResult()
          , data: $scope.getCompanyListData()
        });

        $('#company-map-choose').on('change', function() {
          var selected = $('#company-map-choose').select2('data');
          if (selected) {
            $timeout(function() {
              $scope.companySelection({'listId': selected.id, 'description': selected.text});
            });
          }
        });

      }, 400);
    });
  };

  $scope.getCompanyListData = function() {
    var results = [];
    if ($scope.company.list && $scope.company.list.length > 0) {
      for (var i = 0; i < $scope.company.list.length; i++) {
        var id = $scope.company.list[i].id;
        var text = $scope.company.list[i].collection_name;

        results.push({'id': id, 'text': text});
      };
    }
    return results;
  };

  $scope.loadFirstList = function() {
    if (!$scope.company.list || $scope.company.list.length == 0) {
      return;
    }
    var selected = $scope.company.list[0];
    $scope.companySelection(selected);
    $('#company-map-choose').select2('data', {'id': selected.listId, 'text': selected.description});

    $timeout(function() {
      $scope.company.selected = selected;
      $scope.doSearch(0);
    }, 250);
  }

  $scope.calculateListHeight = function() {
    $timeout( function() {
      if ($window.innerHeight && $('#action-box-header').height()) {
        $scope.listHeight = $window.innerHeight - ($('#action-box-header').height() + 173);
      }
    }, 250);
  };

  $scope.loadPage = function(index) {
    var page = $scope.page + index;

    if (page == 0 || page > $scope.totalPages) {
      return;
    }

    $scope.page = page;
    $scope.doSearch(page);
  }

  $scope.doSearch = function(page) {
    $('#company-map-choose').select2('close');

    var listSelected = $scope.company.selected;

    if ($scope.previousQuery == $scope.company.query && $scope.previousPage == page) {
      return;
    }

    $scope.previousQuery = $scope.company.query;
    $scope.previousPage = page;

    $scope.company.page = page;
    $scope.isLoading = true;

    services.mapListsSearch(listSelected.listId, $scope.company.query, $scope.page, $scope.config.limit,
      function(result) {
        $scope.isLoading = false;

        $scope.companies = result.rows;
      }
    );
  };

  $scope.doSearchOnMap = function(query) {
    var filter = '';

    var layer_name = $scope.company.selected.description;
    var urls = [$scope.config.map.host + "/map/" + $scope.config.map.dbname + "/" + layer_name + "/${z}/${x}/${y}/tile.png?mapkey=123&buffer=16&_=" + Math.random()];

    if ($scope.layer) {
      $scope.map.removeLayer($scope.layer);
    }

    $scope.layer = new OpenLayers.Layer.XYZ(
      layer_name, urls, {
        numZoomLevels: 18,
        isBaseLayer: false,
        visibility: true
      }
    );

    $scope.map.addLayer($scope.layer);
  };

  $scope.companySelection = function(selected) {

    if (selected) {
      $scope.company.selected = selected;
    }

    services.mapListsSearch(selected.listId, $scope.company.query, $scope.page, $scope.config.limit,
      function(result) {
        $scope.companies = result.rows;
        $scope.totalCount = result.total;
        $scope.totalPages = (result.total / $scope.config.limit) + 1;

        $scope.doSearchOnMap();
      }
    );
  };

  $scope.setupMap = function () {
    $scope.baselayer = mapHelper.createBaseLayer({'type': 'nokia-streets', 'numZoomLevels': 20});
    var mapLayers = [$scope.baselayer];

    $scope.map = new OpenLayers.Map({
        div: 'map'
      , projection: mapHelper.mercator()
      , layers: mapLayers
      , controls: [
          new OpenLayers.Control.TouchNavigation({
              dragPanOptions: {
                  enableKinetic: true
              }
          }),
          new OpenLayers.Control.Navigation({
            mouseWheelOptions: {
              interval: 50,
              cumulative: true
            },
            dragPanOptions: {
              enableKinetic: true
            }
          }),
          new OpenLayers.Control.Zoom(),
          new OpenLayers.Control.LayerSwitcher()
        ]
    });

    mapHelper.extendsMap($scope.map);
    mapHelper.center($scope.map, $scope.config.center.longitude, $scope.config.center.latitude, $scope.config.zoom);
    
    $scope.mapLoadingControl = new OpenLayers.Control.LoadingPanel();
    $scope.map.addControl($scope.mapLoadingControl);
  };

  $scope.mapEventFunction = function(info) {
    if (info && info.data) {
      $scope.showOnMap(info.data, false, true);
    }
  };

  $scope.showOnMap = function(item, smoothZoom, showBalloon) {
    // Highlight item on map

    if (item.lon && item.lat) {
      var timeout = 1500;

      if (smoothZoom) {
        var position = new OpenLayers.LonLat(item.lon, item.lat);
        position = mapHelper.transformLatLong(item.lon, item.lat, $scope.map.getProjectionObject(), mapHelper.wgs84());
        $scope.map.smoothZoomTo(position, 15, 200);
        timeout += 1500 + Math.abs($scope.map.getZoom() - 15) * 200;
      }

      if (showBalloon) {
        $timeout(function() {
          $scope.showBalloon(item);
        }, timeout);
      }
    }
  };  

  $scope.createBalloon = function() {

    var position = mapHelper.transformLatLong($scope.config.center.longitude, $scope.config.center.latitude, mapHelper.mercator(), mapHelper.wgs84());
    
    $scope.balloon = new OpenLayers.Popup.FramedCloud(
        'balloon'
      , position
      , new OpenLayers.Size(400, 200)
      , "<div ng-include='box' onload='balloon.updateSize()' style='width:400px; height:200px;'></div>"
      , null 
      , false
    );
    if ($scope.map) {
      $scope.map.addPopup($scope.balloon);
    }

    $timeout(function() {
      $compile($scope.balloon.contentDiv)($scope.balloonScope);
      $scope.hideBalloon();
    });
  };

  $scope.showBalloon = function(data) {

    $scope.balloonScope.box = '/views/partials/map/balloon.html?_=' + Math.random();
    var position = {x : data.lon, y : data.lat};

    $scope.hideBalloon();
    $scope.balloon.lonlat = mapHelper.transformLatLong(position.x, position.y, mapHelper.mercator(), mapHelper.wgs84());
    $scope.balloon.updatePosition();

    $timeout(function() {
      $scope.balloonScope.data = data;
      $compile($scope.balloon.contentDiv)($scope.balloonScope);

      $scope.map.panTo($scope.balloon.lonlat);
      mapHelper.centerMap($scope.map, position.x, position.y);
      $scope.map.moveByPx(202, 147);

      $timeout(function() {
        $scope.balloon.updateSize();
        $scope.balloon.show();
      }, 250);
    });
  };
  
  $scope.hideBalloon = function() {
    if ($scope.balloon) {
      $scope.balloon.hide();
    }
  };

  if (!$scope.mapControllerInitialized) {
    $scope.mapControllerInitialized = true;

    $scope.company = {'list': [], 'selected': null, 'query': ''};
    
    $scope.companies = [];
    $scope.listHeight = 400;

    $timeout(function() {
      $scope.init();

    }, 100);
  };
});
