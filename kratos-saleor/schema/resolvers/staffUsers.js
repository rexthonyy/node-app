const pgKratosQueries = require('../../postgres/kratos-queries');
const { getGraphQLUserById } = require("./lib");

module.exports = async(parent, args, context) => {
    return new Promise((resolve, reject) => {
        if (!context.user) return reject("Please enter a valid authorization header");
        const authUser = context.user;

        let outputStaffUsers = [];
        pgKratosQueries.getUserByIsStaff([true], result => {
            if (result.err == null) return processOutput(resolve, args, outputStaffUsers);
            let staffUsers = result.res;
            const numStaffUsers = staffUsers.length;
            let countStaffUsers = -1;
            staffUsers.forEach(async staffUser => {
                let graphQLUser = await getGraphQLUserById(staffUser.id);
                outputStaffUsers.push(graphQLUser);
                checkStaffUsersComplete();
            });
            checkStaffUsersComplete();

            function checkStaffUsersComplete() {
                countStaffUsers++;
                if (numStaffUsers == countStaffUsers) {
                    processOutput(resolve, args, outputStaffUsers);
                }
            }
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
    // let filterSearch = args.filter.search ? args.filter.search : "";
    // let filterIds = args.filter.ids ? args.filter.ids : "";
    // let sortByDirection = args.sortBy.direction ? args.sortBy.direction : "";
    // let sortByField = args.sortBy.field ? args.sortBy.field : "";
    // let before = args.before ? args.before : "";
    // let after = args.after ? args.after : "";
    // let first = args.first ? args.first : "";
    // let last = args.last ? args.last : "";

    // if (!(first || last)) {
    //     return reject(getError(
    //         "first|last",
    //         "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
    //         "REQUIRED",
    //         null,
    //         null,
    //         null
    //     ));
    // }

    // if (!(first || last)) {
    //     return reject(getError(
    //         "first|last",
    //         "You must provide a `first` or `last` value to properly paginate the `permissionGroups` connection.",
    //         "REQUIRED",
    //         null,
    //         null,
    //         null
    //     ));
    // }

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