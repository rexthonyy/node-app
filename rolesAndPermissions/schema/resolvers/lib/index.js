const hasPermission = (permissions, required) => {
    console.log(permissions);
    let found = false;
    for (let p in permissions) {
        for (let r in required) {
            if (p == r) {
                if (permissions[p] == true) {
                    found = true;
                    break;
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