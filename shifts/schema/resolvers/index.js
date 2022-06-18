const getShiftGroups = require("./getShiftGroups");
const getShiftGroupMembers = require("./getShiftGroupMembers");
const getNonShiftGroupMembers = require("./getNonShiftGroupMembers");
const getShifts = require("./getShifts");
const getAllUniqueShifts = require("./getAllUniqueShifts");
const getRequests = require("./getRequests");
const getAllRequests = require("./getAllRequests");
const getDayNotes = require("./getDayNotes");
const shiftGroupCreate = require("./shiftGroupCreate");
const shiftGroupReorder = require("./shiftGroupReorder");
const shiftGroupRename = require("./shiftGroupRename");
const shiftGroupDelete = require("./shiftGroupDelete");
const shiftGroupMemberAdd = require("./shiftGroupMemberAdd");
const shiftGroupMembersReorder = require("./shiftGroupMembersReorder");
const shiftGroupMemberRemove = require("./shiftGroupMemberRemove");
const assignedShiftAdd = require("./assignedShiftAdd");
const assignedShiftEdit = require("./assignedShiftEdit");
const assignedShiftDelete = require("./assignedShiftDelete");
const assignedShiftMoveToOpen = require("./assignedShiftMoveToOpen");
const openShiftAdd = require("./openShiftAdd");
const openShiftEdit = require("./openShiftEdit");
const openShiftDelete = require("./openShiftDelete");
const openShiftAssign = require("./openShiftAssign");
const timeOffAdd = require("./timeOffAdd");
const timeOffEdit = require("./timeOffEdit");
const timeOffDelete = require("./timeOffDelete");
const dayNoteUpdate = require("./dayNoteUpdate");
const requestCreateTimeOff = require("./requestCreateTimeOff");
const requestCreateSwap = require("./requestCreateSwap");
const requestCreateOffer = require("./requestCreateOffer");
const cancelRequestSwap = require("./cancelRequestSwap");
const cancelRequestOffer = require("./cancelRequestOffer");
const updateSettings = require("./updateSettings");

module.exports = {
    Query: {
        getShiftGroups,
        getShiftGroupMembers,
        getNonShiftGroupMembers,
        getShifts,
        getAllUniqueShifts,
        getRequests,
        getAllRequests,
        getDayNotes,
    },
    Mutation: {
        shiftGroupCreate,
        shiftGroupReorder,
        shiftGroupRename,
        shiftGroupDelete,
        shiftGroupMemberAdd,
        shiftGroupMembersReorder,
        shiftGroupMemberRemove,
        assignedShiftAdd,
        assignedShiftEdit,
        assignedShiftDelete,
        assignedShiftMoveToOpen,
        openShiftAdd,
        openShiftEdit,
        openShiftDelete,
        openShiftAssign,
        timeOffAdd,
        timeOffEdit,
        timeOffDelete,
        dayNoteUpdate,
        requestCreateTimeOff,
        requestCreateSwap,
        requestCreateOffer,
        cancelRequestSwap,
        cancelRequestOffer,
        updateSettings
    }
};