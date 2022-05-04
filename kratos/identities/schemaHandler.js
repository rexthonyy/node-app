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

    getDefaultJSONSchema(){
      let default_schema_id = this.getDefaultJSONSchemaId();
      let selectedSchema = null;
      let schemas = this.config.identity.schemas;
      for(let i = 0, j = schemas.length; i < j; i++){
        let schema = schemas[i];
        if(schema.id == default_schema_id){
          selectedSchema = fs.readFileSync(`.${schema.url}`, "utf8");
        }
      }
      return selectedSchema;
    }

    getDefaultJSONSchemaId(){
      return this.config.identity.default_schema_id;
    }
}

const handler = new JSONSchemaHandler();

const getJSONSchemaById = (id) => {
  return handler.getJSONSchemaById(id);
};

const getDefaultJSONSchema = () => {
  return handler.getDefaultJSONSchema();
};

const getDefaultJSONSchemaId = () => {
  return handler.getDefaultJSONSchemaId();
}

module.exports = {
    getJSONSchemaById,
    getDefaultJSONSchema,
    getDefaultJSONSchemaId
}