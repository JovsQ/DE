app.controller('MainController', ['$scope', function($scope){

	$scope.years = [];
	$scope.regions = [];
	$scope.pollutants = {};

	$scope.init = function(){
		console.log('main controller init');

		mockValues();

	};

	var mockValues = function(){
		$scope.regions = mockRegions(10);
		$scope.pollutants.station = mockPollutants(12);
		$scope.pollutants.mobile = mockPollutants(12);
		$scope.pollutants.area = mockPollutants(12);
	};

	var mockRegions = function(numberOfMockItems){
		var mockRegions = [];

		for (var i = 0; i < numberOfMockItems; i++){
			mockRegions.push(i);
		}

		return mockRegions;
	}

	var mockYears = function(numberOfMockItems){
		var mockYears = [];

		for (var i = 0; i < numberOfMockItems; i++){
			mockYears.push(i);
		}

		return mockYears;
	}

	var mockPollutants = function(numberOfMockItems){
		var mockPollutants = [];
		for (var i = 0; i < numberOfMockItems; i++){
			if (i % 2 == 0) {
				mockPollutants.push(i);
			} else {
				mockPollutants.push('%');
			}
		}

		return mockPollutants;
	}
}]);