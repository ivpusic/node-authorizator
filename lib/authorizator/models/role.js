var util = require('util')
, extend = require('node.extend')
, validator = require('../validators/model_validator');

/**
* Role type constructor
*/
function Role(name) {
    this.name = name;
    this._actions = [];

    this.init = function () {
        this._roleCache = require('../cache/role_cache');
        this._actionCache = require('../cache/action_cache');

        return this;
    };
}

/**
* Function for defining actions which some role can execute
*
* @param {Array or String} actions Action/Actions that we want to bind to some Role instance
* @return {Object} Bound Role instance
*/
Role.prototype.can = function () {
    var i, l;
    for (i = 0, l = arguments.length; i < l; i ++) {
        this._actions.push( this._actionCache.getAction(arguments[i]).name);
    }
    return this;
};

/**
* Function for inheriting actions from some role
*
* @param {String} roleName Name of role which actions we want bind to this Role instance
* @return {Object} Bound Role instance
*/
Role.prototype.inherits = function (roleObj) {
    
    var roleName;

    if (typeof(roleObj) === 'object') { 
        if (validator.validateName(roleObj)) {
            roleName = roleObj.name;
        }
    } else if (typeof(roleObj) === 'string') {
        roleName = roleObj;
    }

    var role = this._roleCache.getRole(roleName, true);
    this._actions = this._actions.concat(role.actions());
    return this;
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
