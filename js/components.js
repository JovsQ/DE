// Add Entry modal
app.component('addEntryComponent', {
	templateUrl: 'views/modal-entry.html',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	},
	controller: function($scope, databaseService){
		var $ctrl = this;

		$ctrl.$onInit = function(){
			$ctrl.source = ['Station', 'Mobile', 'Area'];
		};

		$ctrl.ok = function(value){
			var year = $ctrl.resolve.year.year;
			var region = $ctrl.selectedRegion;
			var source = $ctrl.selectedSource;
			var pollutant = $ctrl.selectedPollutant;
			var value = Number(value);

			console.log('YEAR', year);
			console.log('REGION', region);
			console.log('SOURCE', source);
			console.log('POLLUTANT', pollutant);
			console.log('VALUE', value);

			var latitude = '';
			var longitude = '';

			$ctrl.resolve.regions.forEach(function(regionSnapshot){
				if (regionSnapshot.region == region) {
					latitude = regionSnapshot.latitude;
					longitude = regionSnapshot.longitude;
				}
			})

			// TODO new saving of entry
			databaseService.addNewReading(year, region, latitude, longitude
				, source, pollutant, value)
			.then(function(result){
				console.log('success', result);
				$ctrl.close({$value: result});
			})
			.catch(function(error){
				console.log('error', error)
			});
		};

		$ctrl.regionSelected = function(){
			console.log('current selected region', $ctrl.selectedRegion);
			return $ctrl.selectedRegion != null;
		};

		$ctrl.cancel = function(){
			$ctrl.dismiss({$value: 'cancel'});
		};
	}
});

// Add Pollutant modal
app.component('addPollutantComponent', {
	templateUrl: 'views/modal-pollutant.html',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	},
	controller: function($scope, databaseService){
		var $ctrl = this;

		$ctrl.$onInit = function(){
			console.log('add pollutant modal init');
		};

		$ctrl.ok = function(pollutantName){

			databaseService.addNewPollutant(pollutantName)
			.then(function(result){
				$ctrl.close({$value: true});
			})
			.catch(function(error){
				console.log(error);
			})

			// var yearId = $ctrl.resolve.year.key;

			// databaseService.checkIfPollutantExist(yearId, pollutantName)
			// .then(function(result){
			// 	if (!result) {
			// 		databaseService.addPollutant(yearId, pollutantName)
			// 		.then(function(addPollutantResult){
			// 			$ctrl.close({$value: true});
			// 		})
			// 		.catch(function(error){
			// 			console.log(error);
			// 		})
			// 	} else {
			// 		console.log('pollutant exist');
			// 	}
			// });
		};

		$ctrl.cancel = function(){
			$ctrl.dismiss({$value: 'cancel'});
		};
	}
});


// Add Region modal
app.component('addRegionComponent', {
	templateUrl: 'views/modal-region.html',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	},
	controller: function($scope, databaseService){
		var $ctrl = this;

		$ctrl.$onInit = function(){
			console.log('add region modal init');
		};

		$ctrl.ok = function(regionName, lat, long){
			console.log('LAT', lat);
			console.log('LONG', long);

			databaseService.addNewRegion(regionName, lat, long)
			.then(function(result){
				$ctrl.close({$value: true});
			})
			.catch(function(error){
				console.log(error);
			})
		};

		$ctrl.cancel = function(){
			$ctrl.dismiss({$value: 'cancel'});
		};
	}
});

// Add Year modal
app.component('addYearComponent', {
	templateUrl: 'views/modal-year.html',
	bindings: {
		resolve: '<',
		close: '&',
		dismiss: '&'
	},
	controller: function($scope, databaseService){
		var $ctrl = this;
		$ctrl.years = [];
		$ctrl.filtered_years = [];

		$ctrl.$onInit = function(){
			$ctrl.years = $ctrl.resolve.years;
			getYearsFrom2005();
		};

		$ctrl.ok = function(value){
			// $ctrl.close({$value: value});
			console.log('value', value);
			databaseService.addNewYear(value)
			.then(function(result){
				console.log('result', result);
				$ctrl.close({$value: true});
			})
			.catch(function(error){
				console.log('error', error);
			})
		};

		$ctrl.cancel = function(){
			$ctrl.dismiss({$value: 'cancel'});
		};

		var getYearsFrom2005 = function(){
			$ctrl.filtered_years = [];
			for (var i = (new Date()).getFullYear(); i >= 2005; i--){
				var yearExist = false;
				$ctrl.years.forEach(function(year){
					if (i == year.year) {
						yearExist = true;
					}
				});
				if (!yearExist) {
					$ctrl.filtered_years.push(i);	
				}
			};
			if ($ctrl.filtered_years.length > 0) {
				$ctrl.selectedYear = $ctrl.filtered_years[0];	
			}			
		};
	}
});