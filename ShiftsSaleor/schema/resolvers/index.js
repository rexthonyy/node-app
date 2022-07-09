module.exports = {
    Query: {
        getUser() {
            return "rex";
        }
    },
    Mutation: {
        userCreate: (parent, args) => {
            console.log(args);
            return {
                name: args.name
            };
        },
    }
};