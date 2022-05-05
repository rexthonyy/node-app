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
          selectedSchema = fs.readFileSync(`${schema.url}`, "utf8");
        }
      }
      return selectedSchema;
    }

    getJSONSchemaUrlById(id){
      let schemaUrl = "";
      let schemas = this.config.identity.schemas;
      for(let i = 0, j = schemas.length; i < j; i++){
        let schema = schemas[i];
        if(schema.id == id){
          schemaUrl = schema.url;
          break;
        }
      }
      return schemaUrl;
    }

    getDefaultJSONSchema(){
      let default_schema_id = this.getDefaultJSONSchemaId();
      let selectedSchema = null;
      let schemas = this.config.identity.schemas;
      for(let i = 0, j = schemas.length; i < j; i++){
        let schema = schemas[i];
        if(schema.id == default_schema_id){
          selectedSchema = fs.readFileSync(`${schema.url}`, "utf8");
          break;
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

const getJSONSchemaUrlById = (id) => {
  return handler.getJSONSchemaUrlById(id);
};

const getDefaultJSONSchema = () => {
  return handler.getDefaultJSONSchema();
};

const getDefaultJSONSchemaId = () => {
  return handler.getDefaultJSONSchemaId();
}

module.exports = {
    getJSONSchemaById,
    getJSONSchemaUrlById,
    getDefaultJSONSchema,
    getDefaultJSONSchemaId
}