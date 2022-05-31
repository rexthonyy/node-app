const roles = require('../../../permissions');

const hasPermission = (permissions, required) => {
    let found = false;
    for (let p in permissions) {
        console.log(p);
        if (p.isIn("Permissions")) {
            for (let i = 0; i < required.length; i++) {
                let r = required[i];
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