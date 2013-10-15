/**
 * Function for checking, doest some object have 'name' property
 *
 * @param {Object} object Object to check
 * @returns {Boolean} True if object has 'name' property
 */
module.exports.validateName = function (object) {
    if (object.name) {
        return true;
    }
    throw new Error('Authorizator model type must have name!');
};
