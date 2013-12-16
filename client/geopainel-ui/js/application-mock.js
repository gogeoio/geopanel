'use strict';

var AppMock = angular.module('app.mock', ['geopanel', 'ngMockE2E']);

AppMock.run(function($httpBackend) {

  var savedLists = [];

  $httpBackend.whenPUT(new RegExp('/list')).passThrough();

  $httpBackend.whenGET('/config/company')
    .passThrough();
    // .respond(function(method, url, data) {
    //   var mock = {
    //     logo: "images/logo.png"
    //   }
    //   return [200, mock];
    // });

  $httpBackend.whenGET('/config/menu')
    .passThrough();
    // .respond(function(method, url, data) {
    //   var mock = {
    //     side: [
    //         {icon: "icon-home", name: "Home", tooltip: "Home tooltip", url: "/home"}
    //       , {icon: "icon-building", name: "Empresas", tooltip: "Empresas tooltip", url: "/empresas"}
    //       , {icon: "icon-map-marker", name: "Mapa", tooltip: "Mapa tooltip", url: "/mapa"}
    //     ],
    //     top: [
    //         {icon: "icon-shopping-cart", name: "Store", tooltip: "Store tooltip", url: "/home"}
    //       , {icon: "icon-question-sign", name: "Ajuda", tooltip: "Ajuda tooltip", url: "/home"}
    //     ]
    //   };
    //   return [200, mock];
    // });

  $httpBackend.whenGET('/company/lists')
    .passThrough();
    // .respond(function(method, url, data) {
    //   var mock = _.clone(savedLists);

    //   mock.push({id: 'empresas', type: 'BASE', description: 'list-base-0'});
    //   mock.push({id: 'list-base', type: 'BASE', description: 'list-base-1'});

    //   for (var i = 1; i <= 100; i++) {
    //     mock.push({id: "list-" + i, type: "LIST", description: 'list-name-' + i});
    //   }
    //   return [200, mock];
    // });

  $httpBackend.whenGET('/services/map/layers')
    .passThrough();
    // .respond(function(method, url, data) {
    //   var layers = [
    //       {'id': 2, 'name': 'Potencial de Consumo - HPPC', 'entity': 'ipc_municipios', 'style': 'hppc' }
    //     , {'id': 13, 'name': 'População - Etnia Amarela', 'entity': 'censo_2010_municipios', 'style': 'etnia_amarela'  }
    //   ];
    //   return [200, {
    //     'layers': layers
    //   }];
    // });

  $httpBackend.whenGET(/^\/attributes\/.*/).passThrough();
  
  $httpBackend.whenGET(/\//).passThrough();
  $httpBackend.whenGET(/\/user.*/).passThrough();
  $httpBackend.whenGET(/\/logout.*/).passThrough();
  
  $httpBackend.whenPOST(/\/list.*/).passThrough();
  $httpBackend.whenGET(/\/users.*/).passThrough();
  $httpBackend.whenPOST(/\/users.*/).passThrough();
  $httpBackend.whenGET(/\/list.*/).passThrough();
  $httpBackend.whenPUT(/.*\/lists.*/).passThrough();
  $httpBackend.whenDELETE(/\/list.*/).passThrough();
  
  $httpBackend.whenGET(/^\/map\//).passThrough();
  $httpBackend.whenGET(/^\/views\//).passThrough();
  $httpBackend.whenGET(/^\/js\//).passThrough();
  $httpBackend.whenGET(/^\/libs\//).passThrough();
  $httpBackend.whenGET(/^views\//).passThrough();
  $httpBackend.whenGET(/^locales\//).passThrough();
});
