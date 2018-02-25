app.controller('MainController', ['$scope', function($scope){

	$scope.years = [];
	$scope.regions = [];
	$scope.pollutants = {};
	var pollutants = ["PM","CO","SOX","NOX","VOC"];
	// var pollutants = [];
	var regions = ["Region 1","Region 2","Region 3","NCR","Region 4a","Region 4b","CAR"];
	// var regions = [];
	$scope.year = {};

	$scope.init = function(){
		mockValues();
	};

	var mockValues = function(){
		$scope.year.regions = regions;
		$scope.year.pollutants = {};
		$scope.year.pollutants.station = [];
		$scope.year.pollutants.station = mockPollutants(12);
		$scope.year.pollutants.mobile = [];
		$scope.year.pollutants.mobile = mockPollutants(12);
		$scope.year.pollutants.area = [];
		$scope.year.pollutants.area = mockPollutants(12);
		$scope.year.pollutants_header = generatePollutantHeader(pollutants);
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

	var generatePollutantHeader = function(pollutants){
		var pollutantHeaders = [];

		for (var i = 0; i < pollutants.length; i++){
			pollutantHeaders.push(pollutants[i]);
			pollutantHeaders.push('Regional %');
		}
		pollutantHeaders.push('Total');
		pollutantHeaders.push('Regional %');

		return pollutantHeaders;
	};
}]);