app.service('authService', ['$location', '$q', '$rootScope', function($location, $q, $rootScope){
	var self = this;
	this.ref = firebase.auth();

	this.checkIfAuth = function(){
		var deferred = $q.defer();

		self.ref.onAuthStateChanged(function(user){
			if (user) {
				deferred.resolve();
			} else {
				$location.path('/login');
				$rootScope.$on('$locationChangeSuccess', function(next, current){
					deferred.resolve();
				});
			}
		});

		return deferred.promise;
	};
}]);