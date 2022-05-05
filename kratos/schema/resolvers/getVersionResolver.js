const versionHandler = require('../../identities/versionHandler');

const getData = () => {
    return new Promise((resolve, reject) => {
        resolve({
            version: versionHandler.getVersion()
        });
    });
}

module.exports = async () => {
    return getData();
}