const {
    checkAuthorization,
    getGraphQLPageById,
    getGraphQLAttributeById
} = require('../lib');
const productQueries = require("../../../postgres/product-queries");

module.exports = async(parent, args, context) => {
    return new Promise(async resolve => {
        let { isAuthorized, authUser, status, message } = checkAuthorization(context);
        if (!isAuthorized) return resolve(getGraphQLOutput("authorization-header", message, "INVALID", null));
        attributeCreate(args);
    });
}

function getGraphQLOutput(field, message, code, attribute) {
    return {
        errors: [{
            field,
            message,
            code,
        }],
        attributeErrors: [{
            field,
            message,
            code,
        }],
        attribute
    }
}

function attributeCreate(args) {
    return new Promise(resolve => {
        let slug = args.input.slug;

        productQueries.getAttribute([slug], "slug=$1", async result => {
            if (result.err) return resolve(getGraphQLOutput("getAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
            if (result.res.length > 0) return resolve(getGraphQLOutput("getAttribute", "Attribute slug already exists", "ALREADY_EXISTS", null));

            let inputType = args.input.inputType || "";
            let entityType = args.input.entityType || "";
            let name = args.input.name || "";
            let type = args.input.type;
            let unit = args.input.unit || "";
            let valueRequired = args.input.valueRequired || false;
            let isVariantOnly = args.input.isVariantOnly || false;
            let visibleInStorefront = args.input.visibleInStorefront || false;
            let filterableInStorefront = args.input.filterableInStorefront || false;
            let filterableInDashboard = args.input.filterableInDashboard || false;
            let storefrontSearchPosition = args.input.storefrontSearchPosition || false;
            let availableInGrid = args.input.availableInGrid || false;

            let values = [
                slug,
                name,
                JSON.stringify({}),
                JSON.stringify({}),
                inputType,
                availableInGrid,
                visibleInStorefront,
                filterableInDashboard,
                filterableInStorefront,
                valueRequired,
                storefrontSearchPosition,
                isVariantOnly,
                type,
                entityType,
                unit
            ];

            productQueries.createAttribute(values, async result => {
                if (result.err) return resolve(getGraphQLOutput("createAttribute", JSON.stringify(result.err), "GRAPHQL_ERROR", null));
                if (result.res.length == 0) return resolve(getGraphQLOutput("createAttribute", "Attribute not created", "GRAPHQL_ERROR", null));;
                let attribute_ = result.res[0];
                let inputValues = args.input.values ? args.input.values : [];
                const numValues = inputValues.length;
                let cursor = -1;

                inputValues.forEach(async value => {
                    await createAttributeValues(attribute_.id, value);
                    checkComplete();
                });

                checkComplete();

                async function checkComplete() {
                    cursor++;
                    if (cursor == numValues) {
                        try {
                            let graphQLAttribute = await getGraphQLAttributeById(attribute_.id);
                            resolve({
                                errors: [],
                                attributeErrors: [],
                                attribute: graphQLAttribute
                            });
                        } catch (err) {
                            return resolve(getGraphQLOutput("getGraphQLAttributeById", err, "GRAPHQL_ERROR", null, null, null));
                        }
                    }
                }
            });
        });
    });
}

function createAttributeValues(attributeId, value) {
    return new Promise((resolve) => {
        productQueries.getAttributeValue([attributeId, value.value], "attribute_id=$1 AND (slug=$2 OR value=$2)", async result => {
            if (result.err) return reject();
            let attributeValue;
            if (result.res.length == 0) {
                try {
                    attributeValue = await createAttributeValue(attributeId, value);
                } catch (err) {
                    reject(err);
                }
            } else {
                attributeValue = result.res[0];
            }

            resolve(attributeValue);
        });
    });
}


function createAttributeValue(attributeId, value) {
    return new Promise((resolve, reject) => {
        let file = value.fileUrl;
        let contentType = value.contentType;
        let richText = value.richText;
        let name = value.name;

        let input = [
            name,
            attributeId,
            name,
            0,
            value.value,
            contentType,
            file,
            richText,
            null,
            null,
            null,
            null
        ];

        productQueries.createAttributeValue(input, async result => {
            if (result.err) return reject(JSON.stringify(result.err));
            if (result.res.length == 0) return reject("Failed to create attribute value");
            resolve(result.res[0]);
        });
    });
}