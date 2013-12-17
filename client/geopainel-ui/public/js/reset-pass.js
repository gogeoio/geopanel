
var ResetPass = function($scope, $location, $http, $timeout) {

  $scope.model = {};
  $scope.status = null;

  $scope.isAvailable = false;
  $scope.hideAvailableBtn = true;
  $scope.processed = false;

  $scope.showStatus = function(error, title, message) {
    $scope.status = {
      title: title + '  ',
      message: message,
      type: 'alert alert-' + (error ? 'error' : 'success')
    };
  };

  $scope.submit = function() {

    var params = $scope.model;

    $http.post('/password/reset', params).success(
      function(response, status) {
        if (response.message) {
          return $scope.showStatus(true, 'Atenção!', response.message);
        }
        
        $scope.showStatus(false, '', 'Email enviado com sucesso. Veja a sua caixa de entrada com as instruções para criar uma nova senha.');
        $scope.processed = true;
      }
    ).error(
      function(response) {
        if (response && response.error) {
          return $scope.showStatus(true, 'Atenção!', response.error);
        }
        
        return $scope.showStatus(true, 'Atenção!', 'Ocorreu um erro no servidor. Tente novamente mais tarde.');
      }
    );
  };

  $scope.dismiss = function() {
    $scope.status = null;
  };
};

var NewPass = function($scope, $location, $http, $timeout) {
  $scope.model = {};
  $scope.status = null;

  $scope.isAvailable = false;
  $scope.hideAvailableBtn = true;
  $scope.processed = false;

  $scope.showStatus = function(error, title, message) {
    $scope.status = {
      title: title + '  ',
      message: message,
      type: 'alert alert-' + (error ? 'error' : 'success')
    };
  };

  $scope.submit = function() {

    if (!$scope.checkPass()) {
      $scope.model.passwordAgain = '';
      return $scope.showStatus(true, 'Atenção!', 'Senhas não conferem');
    }

    var params = $scope.model;

    var url = $location.absUrl();
    var code = url[url.length - 2];

    $http.put(url, params).success(
      function(response, status) {
        if (response.message) {
          return $scope.showStatus(true, 'Atenção!', response.message);
        }

        $scope.processed = true;
        $scope.showStatus(false, 'Senha alterada com sucesso.', 'Vá para a página de <b><a href="/login">login</a></b>');
      }
    ).error(
      function(response) {
        if (response && response.error) {
          console.error('error', response.error);
          return $scope.showStatus(true, 'Atenção!', response.error);
        }
        
        return $scope.showStatus(true, 'Atenção!', 'Ocorreu um erro no servidor. Tente novamente mais tarde.');
      }
    );
  };

  $scope.dismiss = function() {
    $scope.status = null;
  };

  $scope.checkPass = function() {
    return $scope.model.password === $scope.model.passwordAgain;
  }

};