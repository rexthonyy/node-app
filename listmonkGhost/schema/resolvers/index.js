const getAllLists = require("./getAllLists");
const getListById = require("./getListById");
const getAllCampaigns = require("./getAllCampaigns");
const getCampaignById = require("./getCampaignById");
const getCampaignHTMLPreview = require("./getCampaignHTMLPreview");
const listCreate = require("./listCreate");
const listUpdate = require("./listUpdate");
const listDelete = require("./listDelete");
const campaignCreate = require("./campaignCreate");
const campaignModifyStatus = require("./campaignModifyStatus");
const campaignDelete = require("./campaignDelete");

module.exports = {
    Query: {
        getAllLists,
        getListById,
        getAllCampaigns,
        getCampaignById,
        getCampaignHTMLPreview
    },
    Mutation: {
        listCreate,
        listUpdate,
        listDelete,
        campaignCreate,
        campaignModifyStatus,
        campaignDelete
    }
};