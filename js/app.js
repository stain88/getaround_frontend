angular
  .module('GetARoundApp', ['angular-jwt', 'ngResource', 'ui.router'])
  .constant('API', 'http://localhost:3000/api')
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  })
  .config(MainRouter);

function MainRouter($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "views/home.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html"
    })
    .state('register', {
      url: "/register",
      templateUrl: "views/register.html"
    });

  $urlRouterProvider.otherwise('/');
}
angular
  .module('GetARoundApp')
  .controller('usersController', UserController);

UserController.$inject = ['User', 'TokenService'];
function UserController(User, TokenService) {
  var self = this;

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
    console.log(User.query());
    self.allUsers = User.query();
  };

  self.isLoggedIn = function() {
    return !!TokenService.getToken();
  };

  if (self.isLoggedIn()) {
    self.getUsers();
    self.user = TokenService.getUser();
  };
}
angular
  .module('GetARoundApp')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API) {
  return $resource(API+'/users/:id', null, {
    'login': {method: "POST", url:API+'/login'},
    'register':{method:"POST", url:API+'/register'},
    'query': {method:"GET", isArray: true,transformResponse: function(data) {
      return angular.fromJson(data);
    }}
  });
};
angular
  .module('GetARoundApp')
  .factory('AuthInterceptor', AuthInterceptor);

AuthInterceptor.$inject = ['API', 'TokenService'];
function AuthInterceptor(API, TokenService) {
  return {
    request: function(config) {
      var token = TokenService.getToken();
      if (config.url.match(API) && token) {
        config.headers.Authorization = 'Bearer '+token;
      };
      return config;
    },
    response: function(res) {
      if (res.config.url.match(API) && res.data.token) {
        TokenService.saveToken(res.data.token);
      };
      return res;
    }
  }
}
angular
  .module('GetARoundApp')
  .service('TokenService', TokenService);

TokenService.$inject=['$window', 'jwtHelper'];
function TokenService($window, jwtHelper) {
  var self = this;

  self.saveToken = function(token) {
    $window.localStorage.setItem("token", token);
  };

  self.getToken = function() {
    return $window.localStorage.getItem("token");
  };

  self.removeToken = function() {
    $window.localStorage.removeItem("token");
  };

  self.getUser = function() {
    var token = self.getToken();
    return jwtHelper.decodeToken(token);
  }
}
/*!
 * jquery-drawer v3.2.0
 * Flexible drawer menu using jQuery, iScroll and CSS.
 * http://git.blivesta.com/drawer
 * License : MIT
 * Author : blivesta <design@blivesta.com> (http://blivesta.com/)
 */

;(function umd(factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery);
  }
}(function Drawer($) {
  'use strict';
  var namespace = 'drawer';
  var touches = typeof document.ontouchstart != 'undefined';
  var __ = {
    init: function init(options) {
      options = $.extend({
        iscroll: {
          mouseWheel: true,
          preventDefault: false
        },
        showOverlay: true
      }, options);

      __.settings = {
        state: false,
        events: {
          opened: 'drawer.opened',
          closed: 'drawer.closed'
        },
        dropdownEvents: {
          opened: 'shown.bs.dropdown',
          closed: 'hidden.bs.dropdown'
        }
      };

      __.settings.class = $.extend({
        nav: 'drawer-nav',
        toggle: 'drawer-toggle',
        overlay: 'drawer-overlay',
        open: 'drawer-open',
        close: 'drawer-close',
        dropdown: 'drawer-dropdown'
      }, options.class);

      return this.each(function instantiateDrawer() {
        var _this = this;
        var $this = $(this);
        var data = $this.data(namespace);

        if (!data) {
          options = $.extend({}, options);
          $this.data(namespace, { options: options });

          __.refresh.call(_this);

          if (options.showOverlay) {
            __.addOverlay.call(_this);
          }

          $('.' + __.settings.class.toggle).on('click.' + namespace, function toggle() {
            __.toggle.call(_this);
            return _this.iScroll.refresh();
          });

          $(window).resize(function close() {
            __.close.call(_this);
            return _this.iScroll.refresh();
          });

          $('.' + __.settings.class.dropdown)
            .on(__.settings.dropdownEvents.opened + ' ' + __.settings.dropdownEvents.closed, function onOpenedOrClosed() {
              return _this.iScroll.refresh();
            });
        }

      }); // end each
    },

    refresh: function refresh() {
      this.iScroll = new IScroll(
        '.' + __.settings.class.nav,
        $(this).data(namespace).options.iscroll
      );
    },

    addOverlay: function addOverlay() {
      var _this = this;
      var $this = $(this);
      var $overlay = $('<div>').addClass(__.settings.class.overlay + ' ' + __.settings.class.toggle);

      return $this.append($overlay);
    },

    toggle: function toggle() {
      var _this = this;

      if (__.settings.state) {
        return __.close.call(_this);
      } else {
        return __.open.call(_this);
      }
    },

    open: function open() {
      var $this = $(this);

      if (touches) {
        $this.on('touchmove.' + namespace, function disableTouch(event) {
          event.preventDefault();
        });
      }

      return $this
        .removeClass(__.settings.class.close)
        .addClass(__.settings.class.open)
        .css({ 'overflow': 'hidden' })
        .drawerCallback(function triggerOpenedListeners() {
          __.settings.state = true;
          $this.trigger(__.settings.events.opened);
        });
    },

    close: function close() {
      var $this = $(this);

      if (touches) $this.off('touchmove.' + namespace);

      return $this
        .removeClass(__.settings.class.open)
        .addClass(__.settings.class.close)
        .css({ 'overflow': 'auto' })
        .drawerCallback(function triggerClosedListeners() {
          __.settings.state = false;
          $this.trigger(__.settings.events.closed);
        });
    },

    destroy: function destroy() {
      return this.each(function destroyEach() {
        var $this = $(this);
        $(window).off('.' + namespace);
        $this.removeData(namespace);
      });
    }

  };

  $.fn.drawerCallback = function drawerCallback(callback) {
    var end = 'transitionend webkitTransitionEnd';
    return this.each(function setAnimationEndHandler() {
      var $this = $(this);
      $this.on(end, function invokeCallbackOnAnimationEnd() {
        $this.off(end);
        return callback.call(this);
      });
    });
  };

  $.fn.drawer = function drawer(method) {
    if (__[method]) {
      return __[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return __.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.' + namespace);
    }
  };

}));
