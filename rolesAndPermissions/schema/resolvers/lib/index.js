require('../../../permissions');

const hasPermission = (permissions, required) => {
    let found = false;
    for (let p in permissions) {
        for (const r of required) {
            if (p == r) {
                if (permissions[p] == true) {
                    found = true;
                    break;
                }
            }
        }
    }
    return found;
}

module.exports = {
    hasPermission
}