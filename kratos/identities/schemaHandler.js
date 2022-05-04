const fs = require('fs');
const YAML = require('yaml');

class JSONSchemaHandler {
    constructor(){
        const file = fs.readFileSync('./config/schemas/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getJSONSchemaById(id){
      let selectedSchema = null;
      let schemas = this.config.identity.schemas;
      for(let i = 0, j = schemas.length; i < j; i++){
        let schema = schemas[i];
        if(schema.id == id){
          selectedSchema = fs.readFileSync(`.${schema.url}`, "utf8");
        }
      }
      return selectedSchema;
    }

}

const handler = new JSONSchemaHandler();

const getJSONSchemaById = (id) => {
  return handler.getJSONSchemaById(id);
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