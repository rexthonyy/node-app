const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let shiftGroupIds = args.shiftGroupIds;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupReorder(channelId, shiftGroupIds));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupReorder(channelId, shiftGroupIds));
        } else {
            resolve(getGraphQLOutput("failed", "You do not have permission to perform this operation"));
        }
    });
}

function getGraphQLOutput(status, message) {
    return {
        status,
        message
    };
}

function shiftGroupReorder(channelId, shiftGroupIds) {
    return new Promise(resolve => {
        let positionOrder = [];

        for (let i = 0; i < shiftGroupIds.length; i++) {
            positionOrder.push({
                id: shiftGroupIds[i],
                position: (i + 1)
            });
        }

        const numPositions = positionOrder.length;
        let cursor = -1;

        positionOrder.forEach(order => {
            let values = [
                order.id,
                order.position
            ];

            shiftQueries.updateShiftGroupById(values, "position=$2", result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numPositions) {
                resolve(getGraphQLOutput("success", "Shift group order positions updated"));
            }
        }
    });
}