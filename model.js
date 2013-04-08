/* Array to store collection of Schemas */
var models = ['chatrow.js']

/* Exports array for use by app 
 * Use of for loop to serve schemas to app
 */
exports.initialize = function () {
	var l = models.length;
	for (var i = 0; i < l; i++) {
		require(models[i])();
	}
};