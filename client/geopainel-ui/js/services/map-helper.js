'use strict';

App.factory('mapHelper', function ($rootScope, $filter, $location, $timeout) {

  return {

    mercator : function () {
      return new OpenLayers.Projection('EPSG:900913');
    },

    wgs84 : function () {
      return new OpenLayers.Projection('EPSG:4326');
    },

    transformLatLong : function (longitude, latitude, projection, targetProjection) {
      var coordinate = new OpenLayers.LonLat(longitude, latitude);
      coordinate.transform(targetProjection, projection);
      
      return coordinate;
    },

    center : function(targetMap, longitude, latitude, zoomLevel) {
      var coordinate = this.transformLatLong(longitude, latitude, targetMap.getProjectionObject(), this.wgs84());
      var zoom = (zoomLevel) ? zoomLevel : 4;

      targetMap.setCenter(coordinate, zoom);
    }, 

    centerMap : function(targetMap, longitude, latitude) {
      var coordinate = this.transformLatLong(longitude, latitude, targetMap.getProjectionObject(), this.wgs84());

      targetMap.setCenter(coordinate, targetMap.getZoom(), true);
    },

    panTo : function(targetMap, longitude, latitude) {
      var coordinate = this.transformLatLong(longitude, latitude, targetMap.getProjectionObject(), this.wgs84());
      targetMap.panTo(coordinate, this.wgs84());
    },

    createBaseLayer : function (config) {

      var layerType     = config.type;
      var numZoomLevels   = config.numZoomLevels;
      var layerName     = "BaseLayer";

      if (layerType == 'google-hybrid') {
        return new OpenLayers.Layer.Google(
          layerName,
          {type: google.maps.MapTypeId.HYBRID, numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'google-terrain') {
        return new OpenLayers.Layer.Google(
          layerName,
          {type: google.maps.MapTypeId.TERRAIN, numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'google-streets') {
        return new OpenLayers.Layer.Google(
          layerName,
          {numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'google-satellite') {
        return new OpenLayers.Layer.Google(
          layerName,
          {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'nokia-streets') {
        return new OpenLayers.Layer.XYZ(
          layerName, nokiaLayers('normal.day'), {numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'nokia-hybrid') {
        return new OpenLayers.Layer.XYZ(
          layerName, nokiaLayers('hybrid.day'), {numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'nokia-satellite') {
        return new OpenLayers.Layer.XYZ(
          layerName, nokiaLayers('satellite.day'), {numZoomLevels: numZoomLevels}
        );
      } else if (layerType == 'nokia-terrain') {
        return new OpenLayers.Layer.XYZ(
          layerName, nokiaLayers('terrain.day'), {numZoomLevels: numZoomLevels}
        );
      } else {
        return new OpenLayers.Layer.Google(
          layerName,
          {type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22}
        );
      }
    },

    extendsMap : function (targetMap) {

      targetMap.panTo = function (lonlat) {
        if (!this.panTween) {
          this.panTween = new OpenLayers.Tween(this.panMethod);
        }
        var center = this.getCachedCenter();

        if (lonlat.equals(center)) {
          return;
        }

        var from = this.getPixelFromLonLat(center);
        var to = this.getPixelFromLonLat(lonlat);
        var vector = { x: to.x - from.x, y: to.y - from.y };
        var last = { x: 0, y: 0 };

        this.panTween.start( { x: 0, y: 0 }, vector, this.panDuration, {
          callbacks: {
            eachStep: OpenLayers.Function.bind(function(px) {
              var x = px.x - last.x,
                y = px.y - last.y;
              this.moveByPx(x, y);
              last.x = Math.round(px.x);
              last.y = Math.round(px.y);
            }, this),
            done: OpenLayers.Function.bind(function(px) {
              this.moveTo(lonlat);
              this.dragging = false;
              this.events.triggerEvent("moveend");
            }, this)
          }
        });
      };

      targetMap.smoothZoomTo = function(lonlat, zoom, timeout) {

        var actualZoom = this.getZoom();
        var i = actualZoom + 1;

        var fnZoomEnd = function() {
          i++;

          if (i <= zoom) {
            $timeout(function() {
              targetMap.zoomTo(i);
            }, timeout);

          } else {
            targetMap.events.unregister('moveend', targetMap, fnZoomEnd);
          }
        };
        this.events.register('moveend', this, fnZoomEnd);
        this.panTo(lonlat);
      };

      targetMap.addPopup = function (popup, exclusive) {
        if (exclusive) {
          for (var i = this.popups.length - 1; i >= 0; --i) {
            this.removePopup(this.popups[i]);
          }
        }
        popup.map = this;
        this.popups.push(popup);
        var popupDiv = popup.draw();
        
        if (popupDiv) {
          popupDiv.style.zIndex = this.Z_INDEX_BASE['Popup'] + this.popups.length;
          popupDiv.style.opacity = 0;
          this.layerContainerDiv.appendChild(popupDiv);

          $(popupDiv).animate({ opacity: 1 }, 500);
        }
      };
    }
  };
});

function buildUrls(baseUrls, path) {
  var urls = []

  if (_.isArray(baseUrls)) {
    urls = baseUrls;
  } else {
    urls.push(baseUrls);
  }

  for (var i = 0; i < urls.length; i++) {
    urls[i] += path;
  }
  return urls;
};

function nokiaLayers(base) {
  return [
    "http://1.maptile.lbs.ovi.com/maptiler/v2/maptile/newest/" + base + "/${z}/${x}/${y}/256/png8?token=123&app_id=mBCJzriKRMXN-4giYVBc",
    "http://2.maptile.lbs.ovi.com/maptiler/v2/maptile/newest/" + base + "/${z}/${x}/${y}/256/png8?token=123&app_id=mBCJzriKRMXN-4giYVBc",
    "http://3.maptile.lbs.ovi.com/maptiler/v2/maptile/newest/" + base + "/${z}/${x}/${y}/256/png8?token=123&app_id=mBCJzriKRMXN-4giYVBc",
    "http://4.maptile.lbs.ovi.com/maptiler/v2/maptile/newest/" + base + "/${z}/${x}/${y}/256/png8?token=123&app_id=mBCJzriKRMXN-4giYVBc"
  ];
};

function mouseCallback(changeStyle, onMouseEvent) {
  return function (infoLookup, loc, pixel) {
    var mapDiv = this.map.div;

    if (infoLookup) {
      var info;

      for (var idx in infoLookup) {
        info = infoLookup[idx];

        if (changeStyle) {
          mapDiv.style.cursor = (info && info.data) ? 'pointer' : 'default';
        }

        if (onMouseEvent) {
          onMouseEvent(info);
        }
      }
    }
  };
};