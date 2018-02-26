app.controller('MainController', ['$scope', '$q', '$uibModal', 'databaseService', function($scope, $q, $uibModal, databaseService){

	$scope.years = [];
	$scope.regions = [];
	$scope.pollutants = {};
	var pollutants = ["PM","CO","SOX","NOX","VOC"];
	// var pollutants = [];
	var regions = ["Region 1","Region 2","Region 3","NCR","Region 4a","Region 4b","CAR"];
	// var regions = [];
	$scope.year = {};
	$scope.emission_year = [];
	$scope.hasReadings = false;

	$scope.selected_year;

	$scope.addRegion = function(){
		var modalInstance = $uibModal.open({
		  	animation: true,
		  	component: 'addRegionComponent',
		  	resolve: {
		      	year: function(){
		      		return $scope.selected_year;
		      	}
		  	}
		});

		modalInstance.result.then(function(value){
			console.log('result', value);
		}, function () {
		});
	};

	$scope.addYear = function(){
		var modalInstance = $uibModal.open({
		  	animation: true,
		  	component: 'addYearComponent',
		  	resolve: {
		      	years: function(){
		      		return $scope.years;
		      	}
		  	}
		});

		modalInstance.result.then(function(value){
			console.log('result', value);
		}, function () {
		});

		// databaseService.addYear(year)
		// .then(function(result){
		// 	console.log('result', result);
		// }, function(error){
		// 	console.log('error', error);
		// })
	};

	$scope.addYearDisabled = true;

	$scope.init = function(){
		firebaseSignIn()
		.then(function(result){
			// console.log('success callback', result);
			// mockValues();
			// console.log('firebase auth', firebase.auth().currentUser);

			databaseService.getAllYears()
			.then(function(result){
				console.log('result', result);
				$scope.years = result;
				$scope.addYearDisabled = false;
			})
			.catch(function(error){
				console.log('error', error);
			});
		})
		.catch(function(error){
			// console.log('error callback', error)
		});
		// mockValues();
	};

	//mock
	var mockEmissionYear = function() {

		databaseService.getAllYears()
		.then(function(result){
			console.log('result', result);
		});
	}

	var firebaseSignIn = function(){
		var deffered = $q.defer();

		firebase.auth().signInAnonymously()
		.then(function(result){
			deffered.resolve(result);			
		})
		.catch(function(error){
			deffered.reject(error.message)
		});

		return deffered.promise;
	};

	var mockValues = function(){
		console.log('mock values');
		$scope.year.regions = regions;
		$scope.year.pollutants = {};
		$scope.year.pollutants.station = [];
		$scope.year.pollutants.station = mockPollutants(12); // station values
		$scope.year.pollutants.mobile = [];
		$scope.year.pollutants.mobile = mockPollutants(12); // mobile values
		$scope.year.pollutants.area = [];
		$scope.year.pollutants.area = mockPollutants(12); // area values
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

		return pollutantHeaders;
	};
}]);