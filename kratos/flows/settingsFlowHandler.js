const getRequestUrl = () => {
    return "/";
};

const getExpiresAt = () => {
    return new Date(new Date().setMinutes(new Date().getMinutes() + 10));
};

const getActiveMethod = () => {
    return "password";
};

const getType = () => {
    return "api";
};

const getState = () => {
    return "choose method"; //"choose_method" "sent_email" "passed_challenge"
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

const getInternalContext = () => {
    return "{}";
};


module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getType,
    getState,
    getUI,
    getInternalContext
}