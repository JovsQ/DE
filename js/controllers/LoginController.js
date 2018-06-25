app.controller('LoginController', ['$location', '$scope', 'databaseService', function($location, $scope, databaseService) {
	$scope.username = '';
	$scope.password = '';

	// console.log('firebase', firebase.auth());


	$scope.login = function(){
		console.log('login');
		databaseService.loginWithAccount($scope.username, $scope.password)
		.then(function(){
			$location.path("/main");
		}, function(error){
			console.log('Authentication error', error);
		})
		// firebase.auth().signOut()
		// .then(function(){
		// 	console.log('success logout');
		// })
		// .catch(function(error){
		// 	console.log('error', error);
		// })
	};
}]);