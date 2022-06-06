const getSettings = require("./getSettings");
const getAllLists = require("./getAllLists");
const getListById = require("./getListById");
const getAllCampaigns = require("./getAllCampaigns");
const getCampaignById = require("./getCampaignById");
const getCampaignHTMLPreview = require("./getCampaignHTMLPreview");
const settingCreate = require("./settingCreate");
const settingUpdate = require("./settingUpdate");
const settingDelete = require("./settingDelete");
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
        getCampaignHTMLPreview,
        getSettings
    },
    Mutation: {
        listCreate,
        listUpdate,
        listDelete,
        campaignCreate,
        campaignModifyStatus,
        campaignDelete,
        settingCreate,
        settingUpdate,
        settingDelete
    }
};