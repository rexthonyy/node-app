const jwt = require('jsonwebtoken');
module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        let email = args.email;
        let token = args.token;

        console.log(email);
        console.log(token);

        if (!isEmailValid(email)) return resolve(getError("email", "Email format not supported", "INVALID_CREDENTIALS", null));

        jwt.verify(token, process.env.AUTHORIZATION_TOKEN_SECRET, (err, payload) => {
            if (err) return resolve(getError("token", "Email format not supported", "JWT_INVALID_TOKEN", null));
            console.log(payload);
        });
    });
}

function getError(field, message, code, addressType, user) {
    return {
        errors: [{
            field,
            message,
            code,
            addressType
        }],
        accountErrors: [{
            field,
            message,
            code,
            addressType
        }],
        user
    };
}