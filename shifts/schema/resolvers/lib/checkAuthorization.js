let checkAuthorization = context => {
    if (!context.user) return returnData(false, null, "failed", "Please enter a valid authorization header");
    const authUser = context.user;
    if (!authUser.isStaff) return returnData(false, null, "failed", "Staff only. Non staff cannot have access");
    return returnData(true, authUser)
};

function returnData(isAuthorized, authUser, status, message) {
    return { isAuthorized, authUser, status, message };
}

module.exports = checkAuthorization;