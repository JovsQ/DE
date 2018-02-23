app.controller('MainController', ['$scope', function($scope){

	$scope.regions = [];

	$scope.init = function(){
		console.log('main controller init');
		for (var i = 0; i < 10; i++){
			$scope.regions.push(i);
		}
		console.log('regions length', $scope.regions.length);

	};
}]);