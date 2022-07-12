const { formatMetadata } = require("../../../libs/util");
const productQueries = require("../../../postgres/product-queries");

let getGraphQLAttributeById = (id) => {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([id], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                return reject("Attribute not found");
            }

            let attribute = result.res[0];

            resolve({
                id: attribute.id,
                privateMetadata: formatMetadata(attribute.private_metadata),
                metadata: formatMetadata(attribute.metadata),
                inputType: attribute.input_type,
                entityType: attribute.entity_type,
                name: attribute.name,
                slug: attribute.slug,
                type: attribute.type,
                unit: attribute.unit,
                valueRequired: attribute.value_required,
                visibleInStorefront: attribute.visible_in_storefront,
                filterableInStorefront: attribute.filterable_in_storefront,
                filterableInDashboard: attribute.filterable_in_dashboard,
                availableInGrid: attribute.available_in_grid,
                storefrontSearchPosition: attribute.storefront_search_position,
                withChoices: false
            });
        });

    });
};

module.exports = getGraphQLAttributeById;