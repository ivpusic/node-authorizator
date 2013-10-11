var Role = require('./models/role');

/**
* Policy constructor
*/
function Policy() {
    this.roles = {};
}

/**
* Virtual method which must be overrider by Policy implementation
*/
Policy.prototype.authorize = function () {
    throw new Error('Policy authorize method must be overriden!');
};

module.exports = Policy;
