var util = require('util')
, Authorizator = require('../index')
, Policy = require('../policy');

/**
* ActionBasedPolicy constructor
*/
function ActionBasedPolicy () {
    this.name = 'action';

    this.init = function () {
        this._roleCache = require('../cache/role_cache');
        this._actionCache = require('../cache/action_cache');

        return this;
    };
}

/**
* Here we inherits virtual methods which we need to implement
*/
util.inherits(ActionBasedPolicy, Policy);

/**
* Implementation of authorize function. 
* Function will try to authorize users based on actions which they can execute
*
* @param {Object} args Arguments (action and role) of authorize function
*/
ActionBasedPolicy.prototype.authorize = function (args) {

    var action = this._actionCache.getAction(args.action, true)
    , roleName = args.role;

    if (action && roleName) {
        var role = this._roleCache.getRole(roleName, true);
        var actions = role.actions();
        if (actions.indexOf(action.name) >= 0) {
            return true;
        }
        return false;
    }
    throw new Error('You must provide action and role values to use this policy!');
};

module.exports = new ActionBasedPolicy();
