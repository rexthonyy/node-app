const fs = require('fs');
const YAML = require('yaml');

class JSONSchemaHandler {
    constructor(){
        const file = fs.readFileSync('./config/schemas/index.yml', 'utf8')
        this.config = YAML.parse(file);
    }

    getJSONSchemaById(id){
      console.log(this.config.identity.schemas);
      this.config.identity.schemas.forEach(schema => {
        if(schema.id == id){
          let file = fs.readFileSync(`.${schema.url}`);
          console.log(file);
          return file;
        }
      });
      return null;
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