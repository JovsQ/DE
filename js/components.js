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