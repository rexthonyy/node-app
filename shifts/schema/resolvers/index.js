const getShiftGroupMembers = require("./getShiftGroupMembers");
const shiftGroupCreate = require("./shiftGroupCreate");

module.exports = {
    Query: {
        getShiftGroupMembers,
    },
    Mutation: {
        shiftGroupCreate,
    }
};