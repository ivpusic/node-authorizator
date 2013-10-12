var util = require('util')
, Authorizator = require('../index')
, Policy = require('../policy')
, RoleCache = require('../cache/role_cache');

/**
* ActionBasedPolicy constructor
*/
function ActionBasedPolicy () {
    this.name = 'action';
}

/**
* Here we inherits virtual methods which we need to implement
*/
//util.inherits(ActionBasedPolicy, Policy);

/**
* Implementation of authorize function. 
* Function will try to authorize users based on actions which they can execute
*
* @param {Object} args Argument of authorize function
*/
ActionBasedPolicy.prototype.authorize = function (args) {

    var action = args.action
    , roleName = args.role;

    if (action && roleName) {
        var role = RoleCache.getRole(roleName);
        if (role) {
            var actions = role.actions();
            if (actions[action]) {
                return true;
            }
            return false;
        }
        throw new Error("Can't find provided role! Role: " + roleName);
    }
    throw new Error('You must provide action and role values to use this policy!');
};

module.exports = ActionBasedPolicy;
