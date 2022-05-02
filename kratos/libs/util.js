const getSessionId = () => {
    return "9f900efa-a5ea-4dfd-8311-a8c7448ffeec";
}

const getSessionExpirationTime = () => {
    return new Date(new Date().setDate(new Date().getDate() + 2));
};

module.exports = {
    getSessionId,
    getSessionExpirationTime
}