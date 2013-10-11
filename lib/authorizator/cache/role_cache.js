var Role = require('../models/role');

/**
* RoleCache constructor
*/
function RoleCache() {
    this._roleCache = {};
}

/**
* Function for adding new role to cache. Function maked new Role instance
*
* @param {String} roleName name of role to add
* @return {Object} Previously added Role instance
*/
RoleCache.prototype.addRole = function (roleName) {
    if(!this._roleCache[roleName]) {
        this._roleCache[roleName] = new Role(roleName, this);
        return this._roleCache[roleName];
    } 
    throw new Error('Role already exist!');
};

/**
* Function for getting role from cache
*
* @param {String} roleName Name of role to get
* @return {Object} Requested Role instance
*/
RoleCache.prototype.getRole = function (roleName) {
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
