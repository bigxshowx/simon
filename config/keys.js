//Prod vs. Dev keys 

if (process.env.NODE_ENV === 'production'){
	//return prod keys
	module.exports = require('./prodKeys');
} else {
	//return dev keys (local machine)
	module.exports = require('./devKeys');
}