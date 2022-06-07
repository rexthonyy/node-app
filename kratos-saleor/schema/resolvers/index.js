const me = require("./me");
const staffUsers = require("./staffUsers");
const user = require("./user");
const tokenCreate = require("./tokenCreate");
const tokenRefresh = require("./tokenRefresh");
const tokenVerify = require("./tokenVerify");
const tokensDeactivateAll = require("./tokensDeactivateAll");
const externalAuthenticationUrl = require("./externalAuthenticationUrl");
const externalObtainAccessTokens = require("./externalObtainAccessTokens");
const externalRefresh = require("./externalRefresh");
const externalLogout = require("./externalLogout");
const externalVerify = require("./externalVerify");
const requestPasswordReset = require("./requestPasswordReset");
const confirmAccount = require("./confirmAccount");
const setPassword = require("./setPassword");
const passwordChange = require("./passwordChange");
const requestEmailChange = require("./requestEmailChange");
const confirmEmailChange = require("./confirmEmailChange");
const accountAddressCreate = require("./accountAddressCreate");
const accountAddressUpdate = require("./accountAddressUpdate");
const accountAddressDelete = require("./accountAddressDelete");
const accountSetDefaultAddress = require("./accountSetDefaultAddress");
const accountRegister = require("./accountRegister");
const accountUpdate = require("./accountUpdate");
const accountRequestDeletion = require("./accountRequestDeletion");
const accountDelete = require("./accountDelete");
const addressCreate = require("./addressCreate");
const addressUpdate = require("./addressUpdate");
const addressDelete = require("./addressDelete");
const addressSetDefault = require("./addressSetDefault");
const customerCreate = require("./customerCreate");
const customerUpdate = require("./customerUpdate");
const customerDelete = require("./customerDelete");
const customerBulkDelete = require("./customerBulkDelete");
const staffCreate = require("./staffCreate");
const staffUpdate = require("./staffUpdate");
const staffDelete = require("./staffDelete");
const staffBulkDelete = require("./staffBulkDelete");
const userAvatarUpdate = require("./userAvatarUpdate");
const userAvatarDelete = require("./userAvatarDelete");
const userBulkSetActive = require("./userBulkSetActive");

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