var app = angular.module('denr-emb', ['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider, $locationProvider, $compileProvider){

	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|tel|blob):/);

	$routeProvider
	.when('/main', {
		templateUrl: 'views/main.html',
		controller: 'MainController'
	})

	.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainController'
	})
	.otherwise({redirectTo: '/main'});

});

app.directive('onlyDigits', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val
                .replace(/[^\d.]/g, '') // accespts only digits
                .replace(/(^[\d]{7})[\d]/g, '$1')   // not more than 3 digits at the beginning
                .replace(/(\..*)\./g, '$1')         // decimal can't exist more than once
                .replace(/(\.[\d]{4})./g, '$1');    // not more than 8 digits after decimal

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return digits;
          }
          return undefined;
        }

        ctrl.$parsers.push(inputValue);
      }
    };
})