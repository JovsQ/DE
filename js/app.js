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