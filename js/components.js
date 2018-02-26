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

		$ctrl.$onInit = function(){
			$ctrl.years = $ctrl.resolve.years;
			console.log('years', $ctrl.years);
			$ctrl.years.forEach(function(year){
				console.log('year', year.name);
			});
			// getYearsFrom2005();
		};

		$ctrl.ok = function(value){
			$ctrl.close({$value: value});
		};

		$ctrl.cancel = function(){
			$ctrl.dismiss({$value: 'cancel'});
		};

		var getYearsFrom2005 = function(){
			var years = [];
			for (var i = 2005; i <= (new Date()).getFullYear(); i++){

				years.push(i);
			};
		};
	}
});