var util = require('util')
, Policy = require('../policy');

/**
* Constructor of RoleBasedPolicy

*/
function RoleBasedPolicy() {

    this.name = 'role';

    // TODO: IMPLEMENTATION
}

util.inherits(RoleBasedPolicy, Policy);

RoleBasedPolicy.prototype.authorize = function(args) {
    var action = args.action
    , role = args.role;
    return true;
};

module.exports = RoleBasedPolicy;
