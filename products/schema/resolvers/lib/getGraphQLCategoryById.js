const productQueries = require("../../../postgres/product-queries");
const getGraphQLCategoryTranslationByCategoryId = require("./getGraphQLCategoryTranslationByCategoryId");
let getGraphQLCategoryById = (categoryId) => {
    return new Promise((resolve, reject) => {
        if (categoryId == null) return resolve(null);
        productQueries.getCategory([categoryId], "id=$1", async result => {
            if (result.err || result.res.length == 0) {
                return reject("Category not found");
            }

            let category = result.res[0];

            let parent = await getGraphQLCategoryById(category.parent_id);
            let translation = await getGraphQLCategoryTranslationByCategoryId(categoryId);

            let res = {
                id: category.id,
                privateMetadata: category.private_metadata,
                privateMetafield: JSON.stringify(category.private_metadata),
                privateMetafields: null,
                metadata: category.metadata,
                metadatafield: JSON.stringify(category.metadata),
                metadatafields: null,
                seoTitle: category.seo_title,
                seoDescription: category.seo_description,
                name: category.name,
                description: category.description,
                slug: category.slug,
                parent,
                level: category.level,
                ancestors: null,
                products: null,
                children: null,
                backgroundImage: {
                    url: category.background_image,
                    alt: category.background_image_alt
                },
                translation,
                descriptionJson: category.description
            };

            resolve(res);
        });
    });
};

module.exports = getGraphQLCategoryById;