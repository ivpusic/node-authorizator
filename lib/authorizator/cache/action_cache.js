var Action = require('../models/action');

/**
* ActionCache constructor
*/
function ActionCache() {
    this._actionCache = {};
}

/**
* Function for adding new action to action cache
* 
* @param {Object} action Action instance
* @return {Object} Added Action object
*/
ActionCache.prototype.add = function (action) {
    if (action.name) {
        this._actionCache[action.name] = action;
        return this._actionCache[action.name];
    }
};

/**
* Function for making new Action instance or retriving existing Action instance from cache
*
* @param {String} name Action name to get
* @return {Object} Action
*
*/
ActionCache.prototype.getAction = function (name) {
    return this._actionCache[name] || this.add(new Action(name));
};

module.exports = new ActionCache();
