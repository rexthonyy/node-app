const { checkAuthorization, getGraphQLUserById } = require('./lib');
const getShiftsByPeople = require("./getShiftsByPeople");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message, null));

        try {
            let shiftsByPeople = await getShiftsByPeople(parent, args, context);
            resolve(getShifts(shiftsByPeople));
        } catch (err) {
            reject(err);
        }
    });
}

function getGraphQLOutput(status, message, result) {
    return {
        status,
        message,
        result
    };
}

function getShifts(shiftsResponse) {
    return new Promise(async resolve => {
        let assignedShifts = shiftsResponse.result.assignedShifts;

        let userShifts = [];

        for (let assignedShift of assignedShifts) {
            for (let shift of assignedShift.shifts) {
                if (shift.type == "shift") {
                    userShifts.push({
                        label: shift.label,
                        break: shift.break,
                        color: shift.color,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                        is24Hours: shift.is24Hours,
                        users: [assignedShift.userId]
                    });
                    console.log(shift);
                    console.log(userShifts);
                }
            }
        }


        let taskShiftsGroupByLabel = {};

        for (let userShift of userShifts) {
            if (taskShiftsGroupByLabel[userShift.label]) {
                taskShiftsGroupByLabel[userShift.label].push(userShift);
            } else {
                taskShiftsGroupByLabel[userShift.label] = [];
                taskShiftsGroupByLabel[userShift.label].push(userShift);
            }
        }

        let taskShifts = [];

        for (const [key, labelGroup] of Object.entries(taskShiftsGroupByLabel)) {
            let taskShiftsGroupsByTime = {};
            for (let g of labelGroup) {
                if (taskShiftsGroupsByTime[(g.startTime + g.endTime)]) {
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)].push(g);
                } else {
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)] = [];
                    taskShiftsGroupsByTime[(g.startTime + g.endTime)].push(g);
                }
            }

            for (const [key, timeGroup] of Object.entries(taskShiftsGroupsByTime)) {
                let taskShiftsGroupsByBreak = {};
                for (let g of timeGroup) {
                    if (taskShiftsGroupsByBreak[g.break]) {
                        taskShiftsGroupsByBreak[g.break].push(g);
                    } else {
                        taskShiftsGroupsByBreak[g.break] = [];
                        taskShiftsGroupsByBreak[g.break].push(g);
                    }
                }

                for (const [key, breakGroup] of Object.entries(taskShiftsGroupsByBreak)) {
                    let taskShiftsGroupsByColor = {};
                    for (let g of breakGroup) {
                        if (taskShiftsGroupsByColor[g.color]) {
                            taskShiftsGroupsByColor[g.color].push(g);
                        } else {
                            taskShiftsGroupsByColor[g.color] = [];
                            taskShiftsGroupsByColor[g.color].push(g);
                        }
                    }

                    for (const [key, colorGroup] of Object.entries(taskShiftsGroupsByColor)) {
                        let taskShiftsGroupsByUser = {};
                        for (let g of breakGroup) {
                            if (taskShiftsGroupsByUser[g.users[0]]) {
                                taskShiftsGroupsByUser[g.users[0]].push(g);
                            } else {
                                taskShiftsGroupsByUser[g.users[0]] = [];
                                taskShiftsGroupsByUser[g.users[0]].push(g);
                            }
                        }

                        for (const [key, userGroup] of Object.entries(taskShiftsGroupsByColor)) {
                            let users = [];
                            for (let g of userGroup) {
                                users.push(await getGraphQLUserById(g.users[0]))
                            }
                            taskShifts.push({
                                label: labelGroup[0].label,
                                break: breakGroup[0].break,
                                color: colorGroup[0].color,
                                startTime: timeGroup[0].startTime,
                                endTime: timeGroup[0].endTime,
                                is24Hours: timeGroup[0].is24Hours,
                                users
                            });
                        }
                    }
                }
            }
        }


        resolve(getGraphQLOutput("success", "Fetch successful", taskShifts));
    });
}