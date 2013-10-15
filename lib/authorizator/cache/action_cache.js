/**
* ActionCache constructor
*/
function ActionCache() {
    this._actionCache = {};
    this.init = function () {
        this.Action = require('../models/action');

        return this;
    };
}

/**
 * Function for checking, does action name already exists
 *
 * @returns {Boolean} True if doesn not exist -> it is available
 */
ActionCache.prototype.checkNameAvability = function (action) {
    if (this._actionCache[action]) {
        throw new Error('Action name already exists!');
    }
    return true;
};

/**
* Function for adding new action to action cache
* 
* @param {Object} action Action instance
* @return {Object} Added Action object
*/
ActionCache.prototype.add = function (action) {
    if (typeof(action) === 'object') {
        if (action.name) {
            this.checkNameAvability();
            this._actionCache[action.name] = action;
            return this._actionCache[action.name];
        }
        throw new Error('Action object must have defined name attribute!');
    } else if(typeof(action) === 'string') {
        this.checkNameAvability();
        this._actionCache[action] = new this.Action(action).init();
        return this._actionCache[action];
    }
};

/**
* Function for making new Action instance or retriving existing Action instance from cache
* If second parameter is true, function will throw Error if action wasn't found in action cache
*
* @param {String} name Action name to get
* @param {Boolean} throwErrorIfNotExist Will we throw error if action does not exist
* @return {Object} Action
*
*/
ActionCache.prototype.getAction = function (name, throwErrorIfNotExist) {
   
    console.log(this._actionCache);

    if (!this._actionCache[name]) {
        if (throwErrorIfNotExist) { throw new Error('Action does not exists!'); }
        else { return this.add(name); }
    }
    return this._actionCache[name];
};

module.exports = new ActionCache();
