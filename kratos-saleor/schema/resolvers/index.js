const me = require("../resolvers/me");
const staffUsers = require("../resolvers/staffUsers");
const user = require("../resolvers/user");
const tokenCreate = require("../resolvers/tokenCreate");
const tokenRefresh = require("../resolvers/tokenRefresh");
const tokenVerify = require("../resolvers/tokenVerify");
const tokensDeactivateAll = require("../resolvers/tokensDeactivateAll");
const externalAuthenticationUrl = require("../resolvers/externalAuthenticationUrl");
const externalObtainAccessTokens = require("../resolvers/externalObtainAccessTokens");
const externalRefresh = require("../resolvers/externalRefresh");
const externalLogout = require("../resolvers/externalLogout");
const externalVerify = require("../resolvers/externalVerify");
const requestPasswordReset = require("../resolvers/requestPasswordReset");
const confirmAccount = require("../resolvers/confirmAccount");
const setPassword = require("../resolvers/setPassword");
const passwordChange = require("../resolvers/passwordChange");
const requestEmailChange = require("../resolvers/requestEmailChange");
const confirmEmailChange = require("../resolvers/confirmEmailChange");
const accountAddressCreate = require("../resolvers/accountAddressCreate");
const accountAddressUpdate = require("../resolvers/accountAddressUpdate");
const accountAddressDelete = require("../resolvers/accountAddressDelete");
const accountSetDefaultAddress = require("../resolvers/accountSetDefaultAddress");
const accountRegister = require("../resolvers/accountRegister");
const accountUpdate = require("../resolvers/accountUpdate");
const accountRequestDeletion = require("../resolvers/accountRequestDeletion");
const accountDelete = require("../resolvers/accountDelete");
const addressCreate = require("../resolvers/addressCreate");
const addressUpdate = require("../resolvers/addressUpdate");
const addressDelete = require("../resolvers/addressDelete");
const addressSetDefault = require("../resolvers/addressSetDefault");
const customerCreate = require("../resolvers/customerCreate");
const customerUpdate = require("../resolvers/customerUpdate");
const customerDelete = require("../resolvers/customerDelete");
const customerBulkDelete = require("../resolvers/customerBulkDelete");
const staffCreate = require("../resolvers/staffCreate");
const staffUpdate = require("../resolvers/staffUpdate");
const staffDelete = require("../resolvers/staffDelete");
const staffBulkDelete = require("../resolvers/staffBulkDelete");
const userAvatarUpdate = require("../resolvers/userAvatarUpdate");
const userAvatarDelete = require("../resolvers/userAvatarDelete");
const userBulkSetActive = require("../resolvers/userBulkSetActive");

module.exports = {
    Query: {
        me,
        staffUsers,
        user
    },
    Mutation: {
        tokenCreate,
        tokenRefresh,
        tokenVerify,
        tokensDeactivateAll,
        externalAuthenticationUrl,
        externalObtainAccessTokens,
        externalRefresh,
        externalLogout,
        externalVerify,
        requestPasswordReset,
        confirmAccount,
        setPassword,
        passwordChange,
        requestEmailChange,
        confirmEmailChange,
        accountAddressCreate,
        accountAddressUpdate,
        accountAddressDelete,
        accountSetDefaultAddress,
        accountRegister,
        accountUpdate,
        accountRequestDeletion,
        accountDelete,
        addressCreate,
        addressUpdate,
        addressDelete,
        addressSetDefault,
        customerCreate,
        customerUpdate,
        customerDelete,
        customerBulkDelete,
        staffCreate,
        staffUpdate,
        staffDelete,
        staffBulkDelete,
        userAvatarUpdate,
        userAvatarDelete,
        userBulkSetActive,
    }
};