var util = require('util')
, modelValidator = require('../validators/model_validator');

/**
* Action type constructor
*/
function Action(name) {
    this.name = name;
    this._roles = [];
    this._minRole = undefined;
    this._rolePriority = undefined;

    this.init = function () {
        this._roleCache = require('../cache/role_cache');
        this._actionCache = require('../cache/action_cache');

        return this;
    };
}

/**
 * Function which sets list of required roles for some action
 *
 * @param {vararg} vararg This is vararg method, and you can pass eather strings or role objects
 * @returns {Object} Instance of Action
 */
Action.prototype.requires = function () {

    var i
    , l;

    for (i = 0, l = arguments.length; i < l; i ++) {
        var role = arguments[i];
        if (typeof(role) === 'object') {
            if (modelValidator.validateName(role)) {
                this._roles.push(role.name);
            }
        } else if (typeof(role) === 'string') {
            this._roles.push(this._roleCache.getRole(role, true).name);
        }
    }
    return this;
};

/**
 * Function for getting all approved roles for some action
 *
 * @returns {Array} array with approved roles
 */
Action.prototype.roles = function () {
    return this._roles;
};

/**
 * Function for getting list of required roles
 *
 * @returns {Array} Array of required roles (role names)
 */
Action.prototype.getRequired = function () {
    return this._roles;
};

/**
 * Function for setting minimum role for some action
 *
 * @param {Object | String} role Role name or role instance
 * @returns {Object} Instance of action
 */
Action.prototype.minRole = function (role) {
    if (typeof(role) === 'object') {
        if (modelValidator.validateName(role)) {
            this._minRole = role.name;
        }
    } else if (typeof(role) === 'string') {
        // second parameter of getRole -> throw error if role wasn't found
        this._minRole = this._roleCache.getRole(role, true).name;
    }
    return this;
};

/**
 * Function for getting minimum required role of some action
 *
 * @returns {String} Name of minimum requred role
 */
Action.prototype.getMinRole = function () {
    return this._minRole;
};

/**
 * Function for setting priority of roles for some action
 *
 * @param {vararg} vararg Vararg method which accepts role names or role instances as arguments
 * @returns {Object} Instance of action
 */
Action.prototype.rolePriority = function () {
    var i
    , l;
    this._rolePriority = [];

    for (i = 0, l = arguments.length; i < l; i ++) {
        var role = arguments[i];
        if (typeof(role) === 'object') {
            if (modelValidator.validateName(role)) {
                this._rolePriority.push(role.name);
            }
        } else if (typeof(role) === 'string') {
            this._rolePriority.push(this._roleCache.getRole(role, true).name);
        }
    }
    return this;
};

/**
 * Function for getting list which contains roles ordered as threir priority
 *
 * @returns {Array} Priority of roles
 */ 
Action.prototype.getRolePriority = function () {
    return this._rolePriority;
};

module.exports = Action;
