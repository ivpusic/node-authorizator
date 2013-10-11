var util = require('util')
, ActionBasedPolicy = require('./policies/action_based')
, RoleCache = require('./cache/role_cache');

/**
* Authorizator main constructor
*/
function Authorizator() {
    this._policies = {};
    this.actionPolicy = new ActionBasedPolicy();
}

/**
* Function to adding new policy to use
*
* @param {String} name Name of policy
* @param {Object} policy Policy instance
* @return {Object} Authorizator instance
*/
Authorizator.prototype.use = function (name, policy) {

    if (!policy) {
        policy = name;
        name = policy.name;
    }

    if (!name) { throw new Error('Authorization policy must have name!'); }

    this._policies[name] = policy;
    return this;
};

/**
* Function for removing policy
*
* @param {String} name Name of policy to remove
* @return {Object} Authorizator instance
*/
Authorizator.prototype.unuse = function (name) {
    if (!name) { throw new Error('You must provide policy name!'); }

    delete this._policies[name];
    return this;
};

/**
* Initialization function. Function sets authorizator options,
* and inits main parts of authorizator module
* 
* @param {Object} options options
* @return {Function} initialization function
*/
Authorizator.prototype.initialize = function (options) {
    // TODO: Apply options to initialization 
    return function (req, res, next) {
        next();
    };
};

/**
* Authorizator main function. It try to authorize user when he want to do some action
*
* @param {String} actionName name of action NOTE: THIS IS TEMPORARY!!!
* @return {Function} Function to authorize
*/
Authorizator.prototype.wants = function (actionName) {
    var args = {'action': actionName};
    return this.actionPolicy.authorize(args);
};

/**
* Function for adding new role to authorizator module
*
* @param {String} roleName Name of new role
* @return {Object} New role instance
*/
Authorizator.prototype.addRole = function (roleName) {
    return RoleCache.addRole(roleName);
};

/**
* Function for getting all roles registered to authorizator
*
* @return {Object} Dict which contains list of roles
*/
Authorizator.prototype.roles = function () {
    return RoleCache.roles();
};

var exports = module.exports = new Authorizator();
exports.Authorizator = Authorizator;
exports.ActionBasedPolicy = ActionBasedPolicy;
