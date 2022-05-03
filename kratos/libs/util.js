const getSessionId = () => {
    return "9f900efa-a5ea-4dfd-8311-a8c7448ffeec";
}

const getSessionExpirationTime = () => {
    return new Date(new Date().setDate(new Date().getDate() + 2));
};


function isEmailValid(email){
	return String(email)
		.toLowerCase()
		.match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
}

module.exports = {
    getSessionId,
    getSessionExpirationTime,
    isEmailValid
}