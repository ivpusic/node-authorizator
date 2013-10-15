var util = require('util')
, ActionBasedPolicy = require('./policies/action_based')
, RoleBasedPolicy = require('./policies/role_based')
, RoleCache = require('./cache/role_cache')
, ActionCache = require('./cache/action_cache');


/**
* Authorizator main constructor
*/
function Authorizator() {
    this._policies = {};
    this._roleLocation = null;
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
* @param {Object or String} policy Name of policy or policy object which we want to remove
* @return {Object} Authorizator instance
*/
Authorizator.prototype.unuse = function (policy) {

    var name;
    if (typeof(policy) === 'string') { name = policy; }
    else if (typeof(policy) === 'object') { name = policy.name; }
    else { throw new Error('You must provide policy name!'); }

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

    RoleCache.init();
    ActionCache.init();
    RoleBasedPolicy.init();
    ActionBasedPolicy.init();

    if (options) {
        if (options.path) {
            this._roleLocation = options.path.split('.');
        }
    }
    if (!this._roleLocation) {
        var rolePath = 'user.role';
        this._roleLocation = rolePath.split('.');
    }

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
    var args = { 'action': actionName }
    , authorizator = this;

    if (!Object.keys(authorizator._policies).length) {
        throw new Error('You must use at least one authorization policy!');
    }

    return function (req, res, next) {

        var role = req
        , authorized
        , i
        , l
        , policy;

        try {
            for (i = 0, l = authorizator._roleLocation.length; i < l; i ++) {
                role = role[authorizator._roleLocation[i]];
            }
        } catch(ex) {
            console.log('Error while authorizing user...');
            res.json('Unauthorized!', 401);
            return;
        }
        args.role = role;

        for (policy in authorizator._policies) {
            if(authorizator._policies.hasOwnProperty(policy)) {
                if(authorizator._policies[policy].authorize(args)) {
                    authorized = true;
                } else {
                    authorized = false;
                    break;
                }
            }
        }
        return authorized ? next() : res.json('Unauthorized!', 401);
    };
};

/**
* Function for adding new role to authorizator module
*
* @param {String} roleName Name of new role
* @return {Object} New role instance
*/
Authorizator.prototype.addRole = function (roleName) {
    return RoleCache.add(roleName);
};

/**
 * Function for getting role
 *
 * @param {String} roleName name of role to get
 * @returns {Object} role instance
 */
Authorizator.prototype.getRole = function (roleName) {
    return RoleCache.getRole(roleName, true);
};

/**
 * Function for adding new action
 *
 * @param {String} actionName name of new action
 * @returns {Object} action instance
 */
Authorizator.prototype.addAction = function (actionName) {
    return ActionCache.add(actionName);
};

/**
 * Function for getting existing action
 *
 * @param {String} actionName name of action to get
 * @returns {Object} action instance
 */
Authorizator.prototype.getAction = function (actionName) {
    return ActionCache.getAction(actionName, true);
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
exports.ActionBasedPolicy = ActionBasedPolicy;
exports.RoleBasedPolicy = RoleBasedPolicy;
