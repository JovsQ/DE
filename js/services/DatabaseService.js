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
			year: year,
			date_added: (new Date()).toString()
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
		self.yearsRef.orderByChild('year').once('value', function(snapshot){
			snapshot.forEach(function(childSnapshot){
				console.log('RESULT', childSnapshot.val());
				var year = {};
				year.key = childSnapshot.key;
				year.year = childSnapshot.val().year;
				year.regions = childSnapshot.val().regions;
				year.pollutants = childSnapshot.val().pollutants;
				years.push(year);
			});
			deffered.resolve(years);
		});

		return deffered.promise;
	};

	this.checkIfRegionExist = function(yearId, regionName){
		var ref = firebase.database().ref('years/' + yearId);
		var deffered = $q.defer();

		ref.once('value', function(snapshot){
			var exist = false;

			var regions = snapshot.val().regions;
			if (typeof regions != 'undefined') {
				regions.forEach(function(region){
					if (region.region == regionName) {
						exist = true;
					}
				});
			}
			

			deffered.resolve(exist);
		});

		return deffered.promise;
	};

	this.addRegion = function(yearId, regionName){
		var ref = firebase.database().ref('years/' + yearId);
		var deffered = $q.defer();

		ref.once('value', function(snapshot){
			var year = snapshot.val();
			var region = {
				region: regionName,
				date_added: (new Date()).toString()
			}
			if (typeof year.regions == 'undefined') {
				year.regions = [];
			}
			year.regions.push(region);

			var updateYear = {};
			updateYear[snapshot.key] = year;
			self.yearsRef.update(updateYear, function(){
				deffered.resolve(year);
			});

		}, function(error){
			deffered.reject(error.message);
		});

		return deffered.promise;
	};

	this.checkIfPollutantExist = function(yearId, pollutantName){
		var ref = firebase.database().ref('years/' + yearId);
		var deffered = $q.defer();

		ref.once('value', function(snapshot){
			var exist = false;

			var pollutants = snapshot.val().pollutants;
			if (typeof pollutants != 'undefined') {
				pollutants.forEach(function(region){
					if (pollutants.region == pollutantName) {
						exist = true;
					}
				});
			}
			
			deffered.resolve(exist);
		}, function(error){
			deffered.reject(error.message);
		});

		return deffered.promise;
	};

	this.addPollutant = function(yearId, pollutantName){
		var ref = firebase.database().ref('years/' + yearId);
		var deffered = $q.defer();

		ref.once('value', function(snapshot){
			var year = snapshot.val();

			var pollutant = {
				pollutant: pollutantName,
				date_added: (new Date()).toString()
			}
			if (typeof year.pollutants == 'undefined') {
				year.pollutants = [];
			}
			year.pollutants.push(pollutant);

			var updateYear = {};
			updateYear[snapshot.key] = year;
			self.yearsRef.update(updateYear, function(){
				deffered.resolve(year);
			});
		}, function(error){
			deffered.reject(error.message);
		});

		return deffered.promise;
	};

}]);