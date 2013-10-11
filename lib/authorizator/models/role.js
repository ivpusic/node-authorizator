var util = require('util')
, ActionCache = require('../cache/action_cache')
, extend = require('node.extend');

/**
* Role type constructor
*/
function Role(name, roleCache) {
    this.name = name;
    this._roleCache = roleCache;
    this._actions = {};
}

/**
* Function for defining actions which some role can execute
*
* @param {Array or String} actions Action/Actions that we want to bind to some Role instance
* @return {Object} Bound Role instance
*/
Role.prototype.can = function (actions) {
    if (util.isArray(actions)) {
        var i, l;
        for (i = 0, l = actions.length; i < l; i ++) {
            this._actions[actions[i]] = ActionCache.getAction(actions[i]);
        }
    } else {
        this._actions[actions] = ActionCache.getAction(actions);
    }
    return this;
};

/**
* Function for inheriting actions from some role
*
* @param {String} roleName Name of role which actions we want bind to this Role instance
* @return {Object} Bound Role instance
*/
Role.prototype.inherits = function (roleName) {
    var role = this._roleCache.getRole(roleName);
    if (role) {
        this._actions = extend(true, this._actions, role.actions());
        return this;
    } 
    throw new Error("Role doesn't exist!");
};

/**
* Function for getting all actions of some role
*
* @return {Object} Dict with roles list
*/
Role.prototype.actions = function () {
    return this._actions;
};

module.exports = Role;
