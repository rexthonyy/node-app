const productQueries = require("../../../postgres/product-queries");
let getGraphQLProductAttributeById = (attributeId) => {
    return new Promise((resolve, reject) => {
        productQueries.getAttribute([attributeId], "id=$1", result => {
            if (result.err || result.res.length == 0) {
                resolve(null);
            } else {
                let attribute = result.res[0];

                resolve({
                    id: attribute.id,
                    privateMetadata: attribute.private_metadata,
                    privateMetafield: JSON.stringify(attribute.private_metadata),
                    privateMetafields: null,
                    metadata: [attribute.metadata],
                    metadatafield: JSON.stringify(attribute.metadata),
                    metadatafields: null,
                    inputType: attribute.input_type,
                    entityType: attribute.entity_type,
                    name: attribute.name,
                    slug: attribute.slug,
                    type: attribute.type,
                    unit: attribute.unit,
                    choices: null,
                    valueRequired: attribute.value_required,
                    visibleInStorefront: attribute.visible_in_storefront,
                    filterableInStorefront: attribute.filterable_in_storefront,
                    filterableInDashboard: attribute.filterable_in_dashboard,
                    availableInGrid: attribute.available_in_grid,
                    storefrontSearchPosition: attribute.storefront_search_position,
                    translation: null,
                    withChoices: attribute.is_variant_only,
                    productTypes: null,
                    productVariantTypes: null
                });
            }
        });
    });
};

module.exports = getGraphQLProductAttributeById;