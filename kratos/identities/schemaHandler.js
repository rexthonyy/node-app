const getJSONSchemaById = (id) => {
    return `
    {
        "$id": "ory://identity-test-schema",
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "IdentitySchema",
        "type": "object",
        "properties": {
          "traits": {
            "type": "object",
            "properties": {
              "name": {
                "type": "object",
                "properties": {
                  "first": {
                    "type": "string"
                  },
                  "last": {
                    "type": "string"
                  }
                }
              }
            },
            "required": [
              "name"
            ],
            "additionalProperties": true
          }
        }
      }
    `;
};

module.exports = {
    getJSONSchemaById
}