app.service('databaseService', ['$q', function($q){
	var self = this;

	this.yearsRef = firebase.database().ref('years/');
	this.regionsRef = firebase.database().ref('regions/');
	this.pollutantsRef = firebase.database().ref('pollutants/');
	this.compilationseRef = firebase.database().ref('compilations/');
	this.readingsRef = firebase.database().ref('readings/');

	this.addNewYear = function(year){
		var deferred = $q.defer();
		var promises = [];

		self.checkYearExist(year)
		.then(function(result){
			if (!result) {
				promises.push(self.addYearToList(year));

				$q.all(promises)
				.then(function(promisesResult){
					deferred.resolve(promisesResult);
				})
				.catch(function(error){
					deferred.reject(error);
				})
			} else{

			}
		});
		

		return deferred.promise;
	};

	this.addYearToList = function(year){
		var deferred = $q.defer();
		var years = {
			year: year,
			date_added: (new Date()).toString()
		}

		var onComplete = function(error){
			if (error) {
				deferred.reject(error.message);
			} else {
				deferred.resolve('year added');
			}
		}

		self.yearsRef.push(years, onComplete);

		return deferred.promise;
	};

	this.addYear = function(year){
		var deferred = $q.defer();
		var years = {
			name: year
		}

		var onComplete = function(error){
			if (error) {
				deferred.reject(error.message);
			} else {
				deferred.resolve('year added.');
			}
		}

		self.checkYearExist(year)
		.then(function(result){
			console.log('check result', result);
			if (!result) {
				self.yearsRef.push(years, onComplete);
			}
		});

		return deferred.promise;
	};

	this.checkYearExist = function(year){
		console.log('get year');
		var deferred = $q.defer();

		self.yearsRef.once('value', function(snapshot){
			var exist = false
			snapshot.forEach(function(childSnapshot){
				if (childSnapshot.val().name == year) {
					exist = true;
				}
			});
			deferred.resolve(exist);
		});

		return deferred.promise;
	};

	this.getAllYears = function(){
		var deferred = $q.defer();
		var years = [];
		self.yearsRef.orderByChild('year').once('value', function(snapshot){
		
			snapshot.forEach(function(childSnapshot){
				years.push(childSnapshot.val());
			});

			deferred.resolve(years);
		});

		return deferred.promise;
	};

	this.getAllRegions = function(){
		var deferred = $q.defer();
		var regions = [];
		self.regionsRef.orderByChild('region').once('value', function(snapshot){
		
			snapshot.forEach(function(childSnapshot){
				regions.push(childSnapshot.val());
			});

			deferred.resolve(regions);
		});

		return deferred.promise;
	};

	this.getAllPollutants = function(){
		var deferred = $q.defer();
		var pollutants = [];
		self.pollutantsRef.orderByChild('pollutant').once('value', function(snapshot){
			
			snapshot.forEach(function(childSnapshot){
				pollutants.push(childSnapshot.val());
			});

			deferred.resolve(pollutants);
		});

		return deferred.promise;
	};

	// this.getAllYears = function(){
	// 	var deferred = $q.defer();
	// 	var years = [];
	// 	self.yearsRef.orderByChild('year').once('value', function(snapshot){
	// 		snapshot.forEach(function(childSnapshot){
	// 			console.log('RESULT', childSnapshot.val());
	// 			var year = {};
	// 			year.key = childSnapshot.key;
	// 			year.year = childSnapshot.val().year;
	// 			year.regions = childSnapshot.val().regions;
	// 			year.pollutants = childSnapshot.val().pollutants;
	// 			years.push(year);
	// 		});
	// 		deferred.resolve(years);
	// 	});

	// 	return deferred.promise;
	// };

	this.checkIfRegionExist = function(yearId, regionName){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

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
			

			deferred.resolve(exist);
		});

		return deferred.promise;
	};

	this.addNewPollutant = function(pollutantName){
		var deferred = $q.defer();
		var pollutant = {
			pollutant: pollutantName,
			date_added: (new Date()).toString()
		}

		var onComplete = function(error){
			if (error) {
				deferred.reject(error.message);
			} else {
				deferred.resolve('pollutant added.');
			}
		}

		self.checkPollutantExist(pollutantName)
		.then(function(result){
			if (!result) {
				self.pollutantsRef.push(pollutant, onComplete);
			}
		});
			
		return deferred.promise;
	};

	this.checkPollutantExist = function(pollutantName){
		var deferred = $q.defer();

		self.pollutantsRef.once('value', function(snapshot){
			var exist = false
			snapshot.forEach(function(childSnapshot){
				if (childSnapshot.val().name == pollutantName) {
					exist = true;
				}
			});
			deferred.resolve(exist);
		});

		return deferred.promise;
	};

	this.addNewRegion = function(regionName){
		var deferred = $q.defer();
		var region = {
			region: regionName,
			date_added: (new Date()).toString()
		}

		var onComplete = function(error){
			if (error) {
				deferred.reject(error.message);
			} else {
				deferred.resolve('region added.');
			}
		}

		self.checkRegionExist(regionName)
		.then(function(result){
			if (!result) {
				self.regionsRef.push(region, onComplete);
			}
		});
			
		return deferred.promise;
	};

	this.checkRegionExist = function(regionName){
		var deferred = $q.defer();

		self.regionsRef.once('value', function(snapshot){
			var exist = false
			snapshot.forEach(function(childSnapshot){
				if (childSnapshot.val().name == regionName) {
					exist = true;
				}
			});
			deferred.resolve(exist);
		});

		return deferred.promise;
	};

	this.addRegion = function(yearId, regionName){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

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
				deferred.resolve(year);
			});

		}, function(error){
			deferred.reject(error.message);
		});

		return deferred.promise;
	};

	this.checkIfPollutantExist = function(yearId, pollutantName){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

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
			
			deferred.resolve(exist);
		}, function(error){
			deferred.reject(error.message);
		});

		return deferred.promise;
	};

	this.addPollutant = function(yearId, pollutantName){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

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
				deferred.resolve(year);
			});
		}, function(error){
			deferred.reject(error.message);
		});

		return deferred.promise;
	};

	this.addEntry = function(yearId, region, source, pollutant, value){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

		ref.once('value', function(snapshot){
			var year = snapshot.val();



			if (typeof year.readings == 'undefined') {
				year.readings = [];

				var stationReading = source == 'Station' ? value : 0;
				var mobileReading = source == 'Mobile' ? value : 0;
				var areaReading = source == 'Area' ? value : 0;

				var reading = {
					region: region,
					pollutant: pollutant,
					source: {
						station: stationReading,
						mobile: mobileReading,
						area: areaReading
					},
					date_added: (new Date()).toString()
				}

				year.readings.push(reading);
			} else {
				year.readings.forEach(function(reading){
					if (reading.region == region && reading.pollutant == pollutant) {
						reading.source.station = source == 'Station' ? value : reading.source.station;
						reading.source.mobile = source == 'Mobile' ? value : reading.source.mobile;
						reading.source.area = source == 'Area' ? value : reading.source.area;
						reading.date_updated =  (new Date()).toString();			
					}
				});
			}

			var updateYear = {};
			updateYear[snapshot.key] = year;
			self.yearsRef.update(updateYear, function(){
				console.log("UPDATED YEAR", year);
				deferred.resolve(year);
			});
		}, function(error){
			deferred.reject(error.message);
		});

		return deferred.promise;
	};

	this.addNewReading = function(selectedYear, selectedRegion, selectedSource, selectedPollutant, inputValue){
		// var ref = firebase.database().ref
		var deferred = $q.defer();

		var reading = {
			year: selectedYear,
			region: selectedRegion,
			source: selectedSource,
			pollutant: selectedPollutant,
			value: inputValue
		};

		var onComplete = function(error){
			if (error) {
				deferred.reject(error.message);
			} else {
				deferred.resolve('region added.');
			}
		};


		self.readingsRef.orderByChild('region').equalTo(selectedRegion).once('value', function(snapshot){
			var exist = false;
			var key;
			snapshot.forEach(function(childSnapshot){
				if (childSnapshot.val().year == selectedYear 
					&& childSnapshot.val().pollutant == selectedPollutant
					&& childSnapshot.val().source == selectedSource) {
					exist = true;
					key = childSnapshot.key;
				}

			})
			if (exist && key) {
				//TODO update
				console.log('update');
				var updateReading = {};
				updateReading[key] = reading;
				self.readingsRef.update(updateReading, function(){
					deferred.resolve('region updated.');
				});
			} else {
				//TODO push
				self.readingsRef.push(reading, onComplete);
			}
		}, function(error){
			deferred.reject(error.message);
		});

		return deferred.promise;
	};

	this.addEntryPerRegion = function(yearId, region, source, pollutant, value){
		var ref = firebase.database().ref('years/' + yearId);
		var deferred = $q.defer();

		ref.once('value', function(snapshot){
			var year = snapshot.val();

			year.regions.forEach(function(regionSnapshot){
				if (regionSnapshot.region == region) {

					if (!regionSnapshot.readings) {
						regionSnapshot.readings = [];

						var reading = {};
						reading.source = source;

						reading.pollutants = [];
						var pollutantObject = {
							pollutant: pollutant,
							value: value
						}
						reading.pollutants.push(pollutantObject);
						regionSnapshot.readings.push(reading);	
					} else {
						var sourceExist = false;
						regionSnapshot.readings.forEach(function(readingSnapshot){
							if (readingSnapshot.source == source) {
								sourceExist = true;
								var pollutantExist = false;
								readingSnapshot.pollutants.forEach(function(pollutantSnapshot){
									if (pollutantSnapshot.pollutant == pollutant) {
										pollutantExist = true;
										pollutantSnapshot.value = value;
									}
								});

								if (!pollutantExist) {
									var pollutantObject = {
										pollutant: pollutant,
										value: value
									}

									readingSnapshot.pollutants.push(pollutantObject);
								}
							}
						});

						if (!sourceExist) {
							var reading = {};
							reading.source = source;

							reading.pollutants = [];
							var pollutantObject = {
								pollutant: pollutant,
								value: value
							}
							reading.pollutants.push(pollutantObject);
							regionSnapshot.readings.push(reading);
						}
					}
					
				}
			});

			var updateYear = {};
			updateYear[snapshot.key] = year;
			self.yearsRef.update(updateYear, function(){
				deferred.resolve(year);
			});
		}, function(error){
			deferred.reject(error.message);
		})

		return deferred.promise;
	};

}]);