const roles = require('../../../permissions');

const hasPermission = (permissions, required) => {
    let found = false;
    for (let p in permissions) {
        console.log(p);
        if (p.isIn("Permissions")) {
            for (let r in required) {
                console.log(r);
                if (p == r) {
                    if (permissions[p] == true) {
                        found = true;
                        break;
                    }
                }
            }
        }
    }
    console.log(found);
    return found;
}

module.exports = {
    hasPermission
}