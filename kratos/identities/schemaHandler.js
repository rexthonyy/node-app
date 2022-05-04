const fs = require('fs');
const YAML = require('yaml');

class JSONSchemaHandler {
    constructor(){
        const file = fs.readFileSync('./config/schemas/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getJSONSchemaById(id){
      this.config.identity.schemas.forEach(schema => {
        if(schema.id == id){
          return fs.readFileSync(`.${schema.url}`);
        }
      });
      return null;
    }

}

const handler = new JSONSchemaHandler();
console.log(handler.getJSONSchemaById("customer"));
const getJSONSchemaById = (id) => {
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