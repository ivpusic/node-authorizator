var util = require('util')
, Policy = require('../policy');

/**
* Constructor of RoleBasedPolicy
*/
function RoleBasedPolicy() {

    this.name = 'role';

    // TODO: IMPLEMENTATION
    this.init = function () {
        this._actionCache = require('../cache/action_cache');
        this._roleCache = require('../cache/role_cache');

        return this;
    };
}

util.inherits(RoleBasedPolicy, Policy);

/**
 * Function for authorizing users based on RoleBasedPolicy
 *
 * @param {Object} args Options for role authentication
 */
RoleBasedPolicy.prototype.authorize = function(args) {
    var action = this._actionCache.getAction(args.action, true)
    , roleName = this._roleCache.getRole(args.role, true).name
    , minRole = action.getMinRole();

    if (minRole) {
        var rolePriorityArray = action.getRolePriority();

        var indexRequires = rolePriorityArray.indexOf(minRole);
        var indexCurrent = rolePriorityArray.indexOf(roleName);
        if (indexRequires >= indexCurrent) { return true; }
    }

    var required = action.getRequired();
    if (required.indexOf(roleName) >= 0) { return true; }

    return false;
};

module.exports = new RoleBasedPolicy();
