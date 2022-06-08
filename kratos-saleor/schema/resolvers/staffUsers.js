const { getAuthenticatedUser, getUserById } = require('./lib');
const pgKratosQueries = require('../../postgres/kratos-queries');

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        getAuthenticatedUser(context, authUser => {
            if (authUser == null) return "user not found";
            let outputStaffUsers = [];
            pgKratosQueries.getUserByIsStaff([true], result => {
                if (result.err == null) return processOutput(resolve, args, outputStaffUsers);
                let staffUsers = result.res;
                const numStaffUsers = staffUsers.length;
                let countStaffUsers = -1;
                for (let i = 0, j = staffUsers.length; i < j; i++) {
                    getUserById(staffUsers[i].id, user => {
                        outputStaffUsers.push(user);
                        checkStaffUsersComplete();
                    });
                }
                checkStaffUsersComplete();

                function checkStaffUsersComplete() {
                    countStaffUsers++;
                    if (numStaffUsers == countStaffUsers) {
                        processOutput(resolve, args, outputStaffUsers);
                    }
                }
            });
        });
    });
}

function processOutput(resolve, args, staffUsers) {
    let edges = [];

    for (let i = 0, j = staffUsers.length; i < j; i++) {
        let staffUser = staffUsers[i];

        edges.push({
            cursor: "",
            node: staffUser
        });
    }

    filterAndSortStaffUsers(resolve, args, edges);
}

function filterAndSortStaffUsers(resolve, args, edges) {
    let filterSearch = args.filter.search;
    let filterIds = args.filter.ids;
    let sortByDirection = args.sortBy.direction;
    let sortByField = args.sortBy.field;
    let before = args.before;
    let after = args.after;
    let first = args.first;
    let last = args.last;

    if (!(first || last)) {
        return reject(getError(
            "first|last",
            "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
            "REQUIRED",
            null,
            null,
            null
        ));
    }

    if (!(first || last)) {
        return reject(getError(
            "first|last",
            "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
            "REQUIRED",
            null,
            null,
            null
        ));
    }

    resolve({
        pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: "",
            endCursor: ""
        },
        edges,
        totalCount: edges.length
    });
}