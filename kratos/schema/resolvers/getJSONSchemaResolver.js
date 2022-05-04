const schemaHandler = require('../../identities/schemaHandler');

const getData = ({id}) => {
    return new Promise((resolve, reject) => {
      console.log(id);
      let jsonSchema = schemaHandler.getJSONSchemaById(id);
      if(!jsonSchema){
        return reject("Schema not found");
      }

      console.log(jsonSchema);
       resolve(JSON.stringify(jsonSchema));
    });
}

module.exports = async (parent, args) => {
    return getData(args);
}