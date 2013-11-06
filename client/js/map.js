var map = L.map('map').setView([-16, -49], 9);
  
var baseMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  // subdomains: "123",
  maxZoom: 18
}).addTo(map);

var host = "http://m{s}.gogeo.com:9090";
var document_name = "db1";
var collection_name = "estados";
var mapkey = "169476c3-09d5-4ec5-974d-fee9a01dac08";

var base_url = host + "/map/" + document_name + "/" + collection_name + "/{z}/{x}/{y}/tile";
var tile_url = base_url + ".png?mapkey=" + mapkey;

var collection_layer = L.tileLayer(tile_url, {
  maxZoom: 18,
  subdomains: "1234"
}).addTo(map);

var utf_url = base_url + ".json?mapkey=" + mapkey + "&callback={cb}";

var utfGrid = new L.UtfGrid(utf_url, {
  useJsonP: true,
  subdomains: "1234"
});

var popup = null;

utfGrid.on('click',
  function (e) {
    if (e && e.data) {
      if (!popup) {
        popup = L.popup()
      }
      popup.setLatLng(e.latlng);
      popup.setContent("<p>" + JSON.stringify(e.data, null, 2) + "</p>");
      popup.openOn(map);
    }
  }
);

map.addLayer(utfGrid);

var baseMaps = {
  "BaseMap": baseMap
};

var overlayMaps = {
  "Map": collection_layer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);