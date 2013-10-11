var util = require('util')
, Authorizator = require('../index')
, Policy = require('../policy')
, RoleCache = require('../cache/role_cache');

/**
* ActionBasedPolicy constructor
*/
function ActionBasedPolicy () {
    this.name = 'action';
    this._actions = [];
}

/**
* Here we inherits virtual methods which we need to implement
*/
util.inherits(ActionBasedPolicy, Policy);

/**
* Implementation of authorize function. 
* Function will try to authorize users based on actions which they can execute
*
* @param {Object} args Argument of authorize function
*/
ActionBasedPolicy.prototype.authorize = function (args) {

    var action = args.action;

    return function (req, res, next) {
        // TODO: CHANGE THIS TO BE DYNAMIC!!!
        var userRole = req.user.role;

        if (action && userRole) {
            var role = RoleCache.getRole(userRole);
            if (role) {
                var actions = role.actions();
                console.log(actions);
                if (actions[action]) {
                    console.log('AUTHORIZED!');
                    next();
                } else {
                    console.log('UNAUTHORIZED!');
                    res.json('Unauthorized!', 401);
                }
                return;
            }
        }
        // TODO: Add more descriptive error!!!
        throw new Error('Error in authorize function!');
    };
};

module.exports = ActionBasedPolicy;
