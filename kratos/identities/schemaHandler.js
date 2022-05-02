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

const getDefaultJSONSchema = (id) => {
  return {
    "id": "/SimpleAddress",
    "type": "object",
    "properties": {
      "firstName": {"type": "string"},
      "lastName": {"type": "string"},
      "email": {"type": "string"},
      "password": {"type": "string"}
    },
    "required": ["firstName","lastName","email","password"]
  };
   
};

const getDefaultJSONSchemaId = () => {
  return "default";
}

module.exports = {
    getJSONSchemaById,
    getDefaultJSONSchema,
    getDefaultJSONSchemaId
}