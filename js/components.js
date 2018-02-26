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

		$ctrl.ok = function(value){
			$ctrl.close({$value: value});
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
					if (i == year.name) {
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