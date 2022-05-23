const versionHandler = require('../../identities/versionHandler');

module.exports = async () => {
    return {
        version: versionHandler.getVersion()
    };
}