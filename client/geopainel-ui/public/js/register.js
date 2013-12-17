
var Register = function($scope, $location, $http, $timeout) {

  $scope.processed = false;
  $scope.isAvailable = false;
  $scope.hideAvailableBtn = true;
  $scope.countdown = false;
  $scope.count = 5;

  $scope.showStatus = function(error, title, message) {
    $scope.status = {
      title: title,
      message: message,
      type: 'alert alert-' + (error ? 'error' : 'success')
    };
  };

  $scope.submit = function(url) {
    if (!$scope.model.password || !$scope.model.confirm) {
      return $scope.showStatus(true, 'Atenção!', 'Os campos de senha são obrigatórios.');
    }

    if ($scope.model.password !== $scope.model.confirm) {
      return $scope.showStatus(true, 'Atenção!', 'Senhas não conferem.');
    }

    if ($scope.model.password && $scope.model.password.length < 4) {
      return $scope.showStatus(true, 'Atenção!', 'A senha deve ter no mínimo 4 caracteres.');
    }

    $http.post(url, $scope.model)
      .success(function(response) {

        $scope.processed = true;
        var loginUrl = response.login;

        if (response && response.message) {
          return $scope.showStatus(true, 'Atenção!', response.message);
        }
        $scope.showStatus(false, '', 'Senha cadastrada com sucesso. Você será redirecionado para o Login em');
        $scope.countdown = true;

        $timeout(function redirect() {
          $scope.count--;
          if ($scope.count == 0) {
            return window.open(loginUrl, '_top');
          }
          $timeout(redirect, 1000);
        }, 1000);
      });
  };

  $scope.dismiss = function() {
    $scope.status = null;
  };
};