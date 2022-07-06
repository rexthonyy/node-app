const getAllRequests = require('./getAllRequests');
const getAllUniqueShifts = require('./getAllUniqueShifts');
const getDayNotes = require('./getDayNotes');
const getNonShiftGroupMembers = require('./getNonShiftGroupMembers');
const getRequests = require('./getRequests');
const getSettings = require('./getSettings');
const getSharedSchedules = require('./getSharedSchedules');
const getShiftGroupMembers = require('./getShiftGroupMembers');
const getShiftGroups = require('./getShiftGroups');
const getShiftsByPeople = require('./getShiftsByPeople');
const getShiftsByTask = require('./getShiftsByTask');

module.exports = {
    queryGetAllRequests: getAllRequests,
    queryGetAllUniqueShifts: getAllUniqueShifts,
    queryGetDayNotes: getDayNotes,
    queryGetNonShiftGroupMembers: getNonShiftGroupMembers,
    queryGetRequests: getRequests,
    queryGetSettings: getSettings,
    queryGetSharedSchedules: getSharedSchedules,
    queryGetShiftGroupMembers: getShiftGroupMembers,
    queryGetShiftGroups: getShiftGroups,
    queryGetShiftsByPeople: getShiftsByPeople,
    queryGetShiftsByTask: getShiftsByTask,
};