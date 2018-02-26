app.service('databaseService', ['$q', function($q){
	var self = this;

	this.yearsRef = firebase.database().ref('years/');
	this.regionsRef = firebase.database().ref('regions/');
	this.pollutantsRef = firebase.database().ref('pollutants/');


	this.addNewYear = function(year){
		var deffered = $q.defer();
		var promises = [];

		self.checkYearExist(year)
		.then(function(result){
			if (!result) {
				promises.push(self.addYearToList(year));

				$q.all(promises)
				.then(function(promisesResult){
					deffered.resolve(promisesResult);
				})
				.catch(function(error){
					deffered.reject(error);
				})
			}
		});

		

		return deffered.promise;
	};

	this.addYearToList = function(year){
		var deffered = $q.defer();
		var years = {
			name: year
		}

		var onComplete = function(error){
			if (error) {
				deffered.reject(error.message);
			} else {
				console.log('ADD YEAR TO LIST');
				deffered.resolve('year added');
			}
		}

		self.yearsRef.push(years, onComplete);

		return deffered.promise;
	};

	this.addYear = function(year){
		var deffered = $q.defer();
		var years = {
			name: year
		}

		var onComplete = function(error){
			if (error) {
				deffered.reject(error.message);
			} else {
				deffered.resolve('year added.');
			}
		}

		self.checkYearExist(year)
		.then(function(result){
			console.log('check result', result);
			if (!result) {
				self.yearsRef.push(years, onComplete);
			}
		});

		return deffered.promise;
	};

	this.checkYearExist = function(year){
		console.log('get year');
		var deffered = $q.defer();

		self.yearsRef.once('value', function(snapshot){
			var exist = false
			snapshot.forEach(function(childSnapshot){
				if (childSnapshot.val().name == year) {
					exist = true;
				}
			});
			deffered.resolve(exist);
		});

		return deffered.promise;
	};

	this.getAllYears = function(){
		var deffered = $q.defer();
		var years = [];
		self.yearsRef.once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
				var year = {};
				year.key = childSnapshot.key;
				year.name = childSnapshot.val().name;

				years.push(year);
			});
			deffered.resolve(years);
		});

		return deffered.promise;
	}

}]);