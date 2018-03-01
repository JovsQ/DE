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

	$scope.selected_year;
	$scope.pollutants_header = [];

	$scope.addEntry = function(){
		console.log('REGION', $scope.selected_year.regions);
		var modalInstance = $uibModal.open({
		  	animation: true,
		  	component: 'addEntryComponent',
		  	resolve: {
		      	year: function(){
		      		return $scope.selected_year;
		      	}
		  	}
		});

		modalInstance.result.then(function(value){
			console.log('MAIN CONTROLLER RESULT', value);
			$scope.init();
		}, function () {
		});	
	}

	$scope.addPollutant = function(){
		var modalInstance = $uibModal.open({
		  	animation: true,
		  	component: 'addPollutantComponent',
		  	resolve: {
		      	year: function(){
		      		return $scope.selected_year;
		      	}
		  	}
		});

		modalInstance.result.then(function(value){
			console.log('result', value);
			$scope.init();
		}, function () {
		});	
	}

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
			$scope.init();
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
			console.log('YEAR ADDED', value);
			$scope.init();
		}, function () {
		});

	};

	$scope.addYearDisabled = true;

	$scope.init = function(){
		console.log('INIT');
		firebaseSignIn()
		.then(function(result){
			// console.log('success callback', result);
			// mockValues();
			// console.log('firebase auth', firebase.auth().currentUser);

			databaseService.getAllYears()
			.then(function(result){
				$scope.years = result;
				if (result.length > 0) {
					$scope.selected_year = result[0];
					console.log('SELECTED YEAR', $scope.selected_year);
					generatePollutantHeader($scope.selected_year.pollutants);
					generateReadings($scope.selected_year.regions, $scope.selected_year.pollutants);
				}				
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
		$scope.pollutants_header = [];

		if (typeof pollutants != 'undefined') {
			for (var i = 0; i < pollutants.length; i++){
				$scope.pollutants_header.push(pollutants[i].pollutant);
				$scope.pollutants_header.push('Regional %');
			};
		}
	};

	$scope.readings = [];

	var generateReadings = function(regions, pollutants){
		$scope.readings = [];
		console.log('GENERATE READINGS by REGION', regions);
		if (regions) {
			regions.forEach(function(regionSnaphot){
				console.log('---region---', regionSnaphot.region);
				
				var region = [];
				region.region = regionSnaphot.region;
				region.station = [];
				region.mobile = [];
				region.area = [];

				if(regionSnaphot.readings){

					pollutants.forEach(function(pollutant){
						var hasStation = false;
						var hasMobile = false;
						var hasArea = false;

						var newPollutant = {
							pollutant: pollutant.pollutant,
							value: 0
						};

						regionSnaphot.readings.forEach(function(readingSnapshot){
							var pollutantExist = false;

							hasStation = readingSnapshot.source == 'Station' ? true : hasStation;
							hasMobile = readingSnapshot.source == 'Mobile' ? true : hasMobile;
							hasArea = readingSnapshot.source == 'Area' ? true : hasArea;

							readingSnapshot.pollutants.forEach(function(pollutantSnapShot){
								if (pollutant.pollutant == pollutantSnapShot.pollutant) {
									pollutantExist = true;
									if (readingSnapshot.source == 'Station') {
										region.station.push(pollutantSnapShot);
									} else if (readingSnapshot.source == 'Mobile') {
										region.mobile.push(pollutantSnapShot);
									} else if (readingSnapshot.source == 'Area') {
										region.area.push(pollutantSnapShot);
									}
								}
							});

							if (!pollutantExist) {

								if (readingSnapshot.source == 'Station') {
									region.station.push(newPollutant);
								} else if (readingSnapshot.source == 'Mobile') {
									region.mobile.push(newPollutant);
								} else if (readingSnapshot.source == 'Area') {
									region.area.push(newPollutant);
								}
							}
						});

						if (!hasStation) {
							region.station.push(newPollutant);
						}
						if (!hasMobile) {
							region.mobile.push(newPollutant);
						}
						if (!hasArea) {
							region.area.push(newPollutant);
						}

					});
				} else {
					// REGION WITH NO READING
					if (pollutants) {
						pollutants.forEach(function(pollutant){
							var newPollutant = {
								pollutant: pollutant.pollutant,
								value: 0
							}

							region.station.push(newPollutant);
							region.mobile.push(newPollutant);
							region.area.push(newPollutant);
						});	
					}
				}

				console.log('REGION', region);
				region.station_values = [];
				region.mobile_values = [];
				region.area_values = [];

				var station_raw = 0;
				var mobile_raw = 0;
				var area_raw = 0;

				for (var i = 0; i < pollutants.length; i++){
					var stationValue = region.station[i].value;
					var mobileValue = region.mobile[i].value;
					var areaValue = region.area[i].value;

					station_raw += stationValue;
					mobile_raw += mobileValue;
					area_raw += areaValue;

					//VALUE
					region.station_values.push(stationValue);
					region.mobile_values.push(mobileValue);
					region.area_values.push(areaValue);

					//PERCENTAGE
					var sum = stationValue + mobileValue + areaValue;
					var stationAverage = sum == 0 ? 0 : stationValue / sum * 100;
					var mobileAverage = sum == 0 ? 0 : mobileValue / sum * 100;
					var areaAverage = sum == 0 ? 0 : areaValue / sum * 100;

					stationAverage = stationAverage.toFixed(4);
					mobileAverage = mobileAverage.toFixed(4);
					areaAverage = areaAverage.toFixed(4);

					region.station_values.push(stationAverage + '%');
					region.mobile_values.push(mobileAverage + '%');
					region.area_values.push(areaAverage + '%');
				}

				//TOTAL
				var sum = station_raw + mobile_raw + area_raw;
				var stationAverage = sum == 0 ? 0 : station_raw / sum * 100;
				var mobileAverage = sum == 0 ? 0 : mobile_raw / sum * 100;
				var areaAverage = sum == 0 ? 0 : area_raw / sum * 100;

				stationAverage = stationAverage.toFixed(4);
				mobileAverage = mobileAverage.toFixed(4);
				areaAverage = areaAverage.toFixed(4);

				region.station_values.push(station_raw);
				region.station_values.push(stationAverage + '%');
				region.mobile_values.push(mobile_raw);
				region.mobile_values.push(mobileAverage + '%');
				region.area_values.push(area_raw);
				region.area_values.push(areaAverage + '%');
				//COMPUTE BEFORE PUSH
				$scope.readings.push(region);
			});
		}
	};

	$scope.hasReadings = function(){
		return typeof $scope.selected_year != 'undefined' ? typeof $scope.selected_year.regions != 'undefined' ? $scope.selected_year.regions.length > 0 ? true : false : false : false;
	};

	$scope.noYearSelected = function(){
		return typeof $scope.selected_year =='undefined';
	};

	$scope.hasPollutants = function(){
		return typeof $scope.selected_year.pollutants != 'undefined' && $scope.selected_year.pollutants.length > 0;
	};

	$scope.hasRegions = function(){
		return typeof $scope.selected_year.regions != 'undefined' && $scope.selected_year.regions.length > 0;
	};

	$scope.noRegionAndPollutant = function(){;
		return $scope.pollutants_header.length == 0 || $scope.hasReadings == false;
	};

	$scope.noRegion = function(){
		return typeof $scope.selected_year == 'undefined' || typeof $scope.selected_year.regions == 'undefined';
	};

	$scope.noPollutants = function(){
		return typeof $scope.selected_year == 'undefined' || typeof $scope.selected_year.pollutants == 'undefined';
	};
}]);