angular
  .module('GetARoundApp')
  .controller('usersController', UserController);

UserController.$inject = ['User', 'TokenService', '$location'];
function UserController(User, TokenService, $location) {
  var self = this;

  self.location = $location.path();

  self.allUsers = [];
  self.user = {};

  function handleLogin(res) {
    var token = res.token ? res.token:null;

    if (token) {
      self.getUsers();
    }
    self.message = res.message;
  };

  self.login = function() {
    User.login(self.user, handleLogin);
  };

  self.register = function() {
    User.register(self.user, handleLogin);
  };

  self.logout = function() {
    TokenService.removeToken();
    self.allUsers = [];
    self.user = {};
  }

  self.getUsers = function() {
    self.allUsers = User.query();
    self.user = TokenService.getUser();
  };

  self.isLoggedIn = function() {
    return !!TokenService.getToken();
  };

  if (self.isLoggedIn()) {
    self.getUsers();
    self.user = TokenService.getUser();
  };
}