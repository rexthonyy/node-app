const getRequestUrl = () => {
    return "/";
};

const getExpiresAt = () => {
    return new Date(new Date().setDate(new Date().getMinutes() + 10));
};

const getActiveMethod = () => {
    return new Date(new Date().setDate(new Date().getMinutes() + 10));
};

const getType = () => {
    return "api";
};

const getUI = () => {
    return "{}";
};

const getRequestedAal = () => {
    return "aal1";
};

const getInternalContext = () => {
    return "{}";
};


module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getType,
    getUI,
    getRequestedAal,
    getInternalContext
}