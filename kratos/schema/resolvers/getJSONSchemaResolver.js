const pgKratosQueries = require('../../postgres/kratos-queries');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify({
            "components": {
              "responses": {
                "emptyResponse": {
                  "description": "Empty responses are sent when, for example, resources are deleted. The HTTP status code for empty responses is\ntypically 201."
                },
                "errorContainer": {
                  "content": {
                    "application/json": {
                      "schema": {
                        "$ref": "#/components/schemas/errorContainer"
                      }
                    }
                  },
                  "description": "User-facing error response"
                }
              }
            }
        }));
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}