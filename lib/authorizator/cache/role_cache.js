/**
* RoleCache constructor
*/
function RoleCache() {
    this._roleCache = {};

    // prevent problems of circular require
    this.init = function () {
        if (!this.Role) {
            this.Role = require('../models/role');
        }
        return this;
    };
}

/**
* Function for adding new role to cache. Function maked new Role instance
*
* @param {String} roleName name of role to add
* @return {Object} Previously added Role instance
*/
RoleCache.prototype.add = function (roleName) {
    this.init();
    if(!this._roleCache[roleName]) {
        this._roleCache[roleName] = new this.Role(roleName).init();
        return this._roleCache[roleName];
    } 
    throw new Error('Role already exist!');
};

/**
* Function for getting role from cache
*
* @param {String} roleName Name of role to get
* @param {Boolean} throwErrorIfNotExist Will we throw error if role is not found?
* @return {Object} Requested Role instance
*/
RoleCache.prototype.getRole = function (roleName, throwErrorIfNotExist) {

    if (!this._roleCache[roleName]) {
        if (throwErrorIfNotExist) { throw new Error('Role does not exists!'); }
        else { return this.add(roleName); }
    }
    return this._roleCache[roleName];
};

/**
* Function for getting all roles from cache
*
* @return {Object} Dich which contains all roles
*/
RoleCache.prototype.roles = function () {
    return this._roleCache;
};

module.exports = new RoleCache();
