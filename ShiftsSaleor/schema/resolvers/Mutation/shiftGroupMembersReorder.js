const shiftQueries = require("../../../postgres/shift-queries");
const { checkAuthorization, userPermissionGroupHasAccess } = require('../lib');

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput(status, message));

        let channelId = args.channelId;
        let shiftGroupId = args.shiftGroupId;
        let userIds = args.userIds;

        if (authUser.userPermissions.find(permission => permission.code == "MANAGE_STAFF")) {
            resolve(await shiftGroupMemberReorder(channelId, shiftGroupId, userIds));
        } else if (userPermissionGroupHasAccess(authUser.permissionGroups, ["MANAGE_STAFF"])) {
            resolve(await shiftGroupMemberReorder(channelId, shiftGroupId, userIds));
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

function shiftGroupMemberReorder(channelId, shiftGroupId, userIds) {
    return new Promise(resolve => {
        let positionOrder = [];

        for (let i = 0; i < userIds.length; i++) {
            positionOrder.push({
                channelId,
                shiftGroupId,
                userId: userIds[i],
                position: (i + 1)
            });
        }

        const numPositions = positionOrder.length;
        let cursor = -1;

        positionOrder.forEach(order => {
            let values = [
                order.channelId,
                order.shiftGroupId,
                order.userId,
                order.position
            ];

            shiftQueries.updateShiftGroupMembersByChannelIdShiftGroupIdAndUserId(values, "position=$4", result => {
                checkComplete();
            });
        });

        checkComplete();

        function checkComplete() {
            cursor++;
            if (cursor == numPositions) {
                resolve(getGraphQLOutput("success", "Shift group member order positions updated"));
            }
        }
    });
}