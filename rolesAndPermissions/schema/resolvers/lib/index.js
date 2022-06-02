require('../../../permissions');

const hasAllPermissions = (permissions, required) => {
    let found = [];

    for (let p in permissions) {
        for (const r of required) {
            if (p == r) {
                if (permissions[p] == true) {
                    found.push(true);
                    break;
                }
            }
        }
    }

    return found.length == required.length;
}

module.exports = {
    hasAllPermissions
}