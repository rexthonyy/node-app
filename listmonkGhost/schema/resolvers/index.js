const getAllLists = require("./getAllLists");
const getListById = require("./getListById");
const listCreate = require("./listCreate");
const listUpdate = require("./listUpdate");
const listDelete = require("./listDelete");

module.exports = {
    Query: {
        getAllLists,
        getListById
    },
    Mutation: {
        listCreate,
        listUpdate,
        listDelete
    }
};