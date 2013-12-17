
var SignUp = function($scope, $location, $http, $timeout) {

  $scope.model = {};
  $scope.status = null;

  $scope.isAvailable = false;
  $scope.hideAvailableBtn = true;
  $scope.processed = false;

  $scope.showStatus = function(error, title, message) {
    $scope.status = {
      title: title,
      message: message,
      type: 'alert alert-' + (error ? 'error' : 'success')
    };
  };

  $scope.submit = function() {

    var params = $scope.model;

    $http.post('/signup', params)
      .success(function(response) {
        if (response.message) {
          return $scope.showStatus(true, 'Atenção!', response.message);
        }
        
        $scope.showStatus(false, '', 'Cadastro efetuado. Aguarde o e-mail de confirmação para liberar sua conta');
        $scope.processed = true;
      });
  };

  $scope.dismiss = function() {
    $scope.status = null;
  };

  $scope.domainChange = function(domain) {
    var name = String(domain || '').replace(/[^a-zA-Z0-9]/g, '');
    $scope.model.domain = name;

    var params = {
      'name': name
    };

    $http.post('/available', params).success(function(result) {
      $scope.isAvailable = result.available;
      $scope.hideAvailableBtn = false;
    });
  }
};