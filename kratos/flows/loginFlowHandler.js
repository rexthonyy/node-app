const getRequestUrl = () => {
    return "/";
};

const getExpiresAt = () => {
    return new Date(new Date().setMinutes(new Date().getMinutes() + 120));
};

const getActiveMethod = () => {
    return "password";
};

const getType = () => {
    return "api";
};

const getUI = () => {
    return JSON.stringify({
        action: "/",
        method: "post",
        messages: [
            {
                context: "current",
                id: "attr",
                text: "info",
                type: "ui"
            }
        ],
        nodes: {
            attributes: {
                type: "id"
            },
            group: "none",
            type: "ui",
            messages: {
                context: "current",
                id: "attr",
                text: "info",
                type: "ui"
            }
        }
    });
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