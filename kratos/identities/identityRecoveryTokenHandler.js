const {uuid} = require('uuidv4');

class IdentityRecoveryTokenHandler {
    generateToken(){
        return uuid().substring(0, 30);
    }
}

const handler = new IdentityRecoveryTokenHandler();


const generateToken = () => {
    return handler.generateToken();
};


module.exports = {
    generateToken
}