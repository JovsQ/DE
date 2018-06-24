app.controller('LoginController', ['$location', '$scope', 'databaseService', function($location, $scope, databaseService) {
	$scope.username = '';
	$scope.password = '';


	$scope.login = function(){
		console.log('login');
		databaseService.loginWithAccount($scope.username, $scope.password)
		.then(function(){
			$location.path("/main");
		}, function(error){
			console.log('Authentication error', error);
		})
	};
}]);