const getRequestUrl = () => {
    return "/";
};

const getExpiresAt = () => {
    return new Date(new Date().setMinutes(new Date().getMinutes() + 120));
};

const getActiveMethod = () => {
    return "password";
};

const getState = () => {
    return "choose method"; //"choose_method" "sent_email" "passed_challenge"
};

const getRecoveredIdentityId = () => {
    return null;
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

module.exports = {
    getRequestUrl,
    getExpiresAt,
    getActiveMethod,
    getState,
    getRecoveredIdentityId,
    getType,
    getUI
}