const db = {
    assigned_shift_activities: "assigned_shift_activities",
    assigned_shifts: "assigned_shifts",
    day_notes: "day_notes",
    open_shift_activities: "open_shift_activities",
    open_shifts: "open_shifts",
    request_offer: "request_offer",
    request_swap: "request_swap",
    request_time_off: "request_time_off",
    requests: "requests",
    settings: "settings",
    shift_activities: "shift_activities",
    shift_group_members: "shift_group_members",
    shift_groups: "shift_groups",
    user_time_offs: "user_time_offs",
    shared_schedules: "shared_schedules",

    account_user: "account_user",
    account_address: "account_address",
    account_user_addresses: "account_user_addresses",
    channel_channel: "channel_channel",

    auth_group: "auth_group",
    auth_permissions: "auth_permission",
    auth_group_permissions: "auth_group_permissions",
    account_user_groups: "account_user_groups",
    account_user_user_permissions: "account_user_user_permissions"
};

const colorValue = {
    WHITE: "#fbf3a0",
    BLUE: "#cce4f7",
    GREEN: "#e8f2d1",
    PURPLE: "#e6e4f8",
    PINK: "#ffd9d9",
    YELLOW: "#fbf3a0",
    GRAY: "#f3f2f1",
    DARK_BLUE: "#cce4f7",
    DARK_GREEN: "#e8f2d1",
    DARK_PURPLE: "#e6e4f8",
    DARK_PINK: "#ffd9d9",
    DARK_YELLOW: "#fbf3a0",
}

const unpaidBreakValue = {
    MIN_0: 0,
    MIN_15: 15,
    MIN_30: 30,
    MIN_45: 45,
    MIN_60: 60,
    MIN_75: 75,
    MIN_90: 90
}

const requestType = {
    requestTimeOff: "requestTimeoff",
    requestOffer: "requestOffer",
    requestSwap: "requestSwap"
}

const requestStatus = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    cancelled: "cancelled"
}

const settingsType = {
    start_of_week: "start_of_week",
    open_shifts: "open_shifts",
    requests: "requests",
    copying_shifts: "copying_shifts"
}

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
    colorValue,
    unpaidBreakValue,
    requestType,
    requestStatus,
    settingsType,
    events
};