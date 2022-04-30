const express = require("express");
const router = express.Router();
const util = require('../util');
const consts = require('../consts');

router.get("/", (req, res) => {
    res.send("Welcome to the reaction commerce api endpoints");
});

router.get("/shopBySlug/:slug", (req, res) => {
    let slug = req.params.slug;
    let options =  {
		method: "POST",
		headers: {
			'Content-Type': 'application/json',
            'Authorization': consts.reactionCommerceAuthorization
		},
        body: JSON.stringify({
            query: `
                query shopBySlug($slug: String!){
                    shopBySlug(slug: $slug){
                        _id
                        allowGuestCheckout
                        defaultNavigationTreeId
                        description
                        keywords
                        language
                        name
                        slug
                        timezone
                    }
                }
            `,
            variables: {
                "slug": `${slug}`
            }
        })
	}

    sendRequest(res, options);
});

router.get("/createShop", (req, res) => {
    let options =  {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
        body: JSON.stringify({
            query: `
                mutation createShop($input: CreateShopInput!){
                    createShop(input: $input){
                    clientMutationId
                    }
                }
            `,
            variables: {
              name: "Remote MacDonald"
            }
        })
	}
    sendRequest(res, options);
});

function sendRequest(res, options){
    util.sendRequest(consts.GRAPHQL_REACTION_COMMERCE_API_ENDPOINT, options)
    .then(json => {
        res.json(json);
    });
}

module.exports = router;