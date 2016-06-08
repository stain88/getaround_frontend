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
    })
    .state('event', {
      url: "/event",
      templateUrl: "views/event.html"
    })
    .state('history', {
      url: "/history",
      templateUrl: "views/history.html"
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
angular
  .module('GetARoundApp')
  .factory('User', User);

User.$inject = ['$resource', 'API'];
function User($resource, API) {
  return $resource(API+'/users/:id', null, {
    'login': {method: "POST", url:API+'/login'},
    'register':{method:"POST", url:API+'/register'},
    'query': {method:"GET", isArray: false,transformResponse: function(data) {
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

var map;
var infowindow;
var pos;


function get_location(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      
    startMap();
    });
  } else {
    // Browser doesn't support Geolocation
	console.log("error: doesn't support geolocation");
}


}


function startMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: pos,
    zoom: 17
  });
  
  var centerControlDiv = document.createElement('div');
var centerControl = new CenterControl(centerControlDiv, map);

centerControlDiv.index = 1;
map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
  
  
  var image = 'img/current_location_icon.png';
  var current_location_marker = new google.maps.Marker({
    position: pos,
    map: map,
    icon: image
  });
  

  infowindow = new google.maps.InfoWindow();
  
  
  
  var bars = new google.maps.places.PlacesService(map);
  bars.nearbySearch({
    location: pos,
    radius: 1000,
    type: "bar"
  }, callback);
  
  var restaurants = new google.maps.places.PlacesService(map);
  restaurants.nearbySearch({
    location: pos,
    radius: 1000,
    type: "restaurant"
  }, callback);
  
  
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#37c1f0';
        controlUI.style.border = '2px solid #4c4c4d';
        controlUI.style.borderRadius = '15px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '50px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = '#ffffff';
        controlText.style.fontFamily = 'Helvetica,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '40px';
        controlText.style.paddingLeft = '20px';
        controlText.style.paddingRight = '20px';
        controlText.innerHTML = 'Check In';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {


        });

      }

function createMarker(place) {

	var image = 'img/event_location.png';
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
	icon: image
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent("<div class=\"infowindow\">" + place.name + "<br /><a href=\"event.html\">Go to Event page</a> </div>");
    infowindow.open(map, this);
  });
}
$(document).ready(function() {
  $('.drawer').drawer();
});