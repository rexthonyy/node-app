const db = {
    account_user: "account_user",
    account_address: "account_address",
    account_user_addresses: "account_user_addresses",

    auth_group: "auth_group",
    auth_permissions: "auth_permission",
    auth_group_permissions: "auth_group_permissions",
    account_user_groups: "account_user_groups",
    account_user_user_permissions: "account_user_user_permissions"
};

const events = [
    "exit",
    "SIGINT",
    "SIGUSR1",
    "SIGUSR2",
    "SIGTERM",
    "uncaughtExecption"
];

module.exports = {
    db,
    events
};