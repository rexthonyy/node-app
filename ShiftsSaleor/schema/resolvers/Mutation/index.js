const assignedShiftAdd = require('./assignedShiftAdd');
const assignedShiftDelete = require('./assignedShiftDelete');
const assignedShiftEdit = require('./assignedShiftEdit');
const assignedShiftMoveToOpen = require('./assignedShiftMoveToOpen');
const assignedShiftShare = require('./assignedShiftShare');
const cancelRequestOffer = require('./cancelRequestOffer');
const cancelRequestSwap = require('./cancelRequestSwap');
const dayNoteUpdate = require('./dayNoteUpdate');
const openShiftAdd = require('./openShiftAdd');
const openShiftAssign = require('./openShiftAssign');
const openShiftDelete = require('./openShiftDelete');
const openShiftEdit = require('./openShiftEdit');
const recallSharedSchedules = require('./recallSharedSchedules');
const requestCreateOffer = require('./requestCreateOffer');
const requestCreateSwap = require('./requestCreateSwap');
const requestCreateTimeOff = require('./requestCreateTimeOff');
const shiftGroupCreate = require('./shiftGroupCreate');
const shiftGroupDelete = require('./shiftGroupDelete');
const shiftGroupMemberAdd = require('./shiftGroupMemberAdd');
const shiftGroupMemberRemove = require('./shiftGroupMemberRemove');
const shiftGroupMembersReorder = require('./shiftGroupMembersReorder');
const shiftGroupRename = require('./shiftGroupRename');
const shiftGroupReorder = require('./shiftGroupReorder');
const timeOffAdd = require('./timeOffAdd');
const timeOffDelete = require('./timeOffDelete');
const timeOffEdit = require('./timeOffEdit');
const updateSettings = require('./updateSettings');

module.exports = {
    mutationAssignedShiftAdd: assignedShiftAdd,
    mutationAssignedShiftDelete: assignedShiftDelete,
    mutationAssignedShiftEdit: assignedShiftEdit,
    mutationAssignedShiftMoveToOpen: assignedShiftMoveToOpen,
    mutationAssignedShiftShare: assignedShiftShare,
    mutationCancelRequestOffer: cancelRequestOffer,
    mutationCancelRequestSwap: cancelRequestSwap,
    mutationDayNoteUpdate: dayNoteUpdate,
    mutationOpenShiftAdd: openShiftAdd,
    mutationOpenShiftAssign: openShiftAssign,
    mutationOpenShiftDelete: openShiftDelete,
    mutationOpenShiftEdit: openShiftEdit,
    mutationRecallSharedSchedules: recallSharedSchedules,
    mutationRequestCreateOffer: requestCreateOffer,
    mutationRequestCreateSwap: requestCreateSwap,
    mutationRequestCreateTimeOff: requestCreateTimeOff,
    mutationShiftGroupCreate: shiftGroupCreate,
    mutationShiftGroupDelete: shiftGroupDelete,
    mutationShiftGroupMemberAdd: shiftGroupMemberAdd,
    mutationShiftGroupMemberRemove: shiftGroupMemberRemove,
    mutationShiftGroupMembersReorder: shiftGroupMembersReorder,
    mutationShiftGroupRename: shiftGroupRename,
    mutationShiftGroupReorder: shiftGroupReorder,
    mutationTimeOffAdd: timeOffAdd,
    mutationTimeOffDelete: timeOffDelete,
    mutationTimeOffEdit: timeOffEdit,
    mutationUpdateSettings: updateSettings,
};