const fs = require('fs');

let fileModulesJSON = [
  { file: "./swagger/swagger_crm.json" },
  { file: "./swagger/swagger_debug.json" },
  { file: "./swagger/swagger_electronic_content_management.json" },
  { file: "./swagger/swagger_emails_and_social_media.json" },
  { file: "./swagger/swagger_financial.json" },
  { file: "./swagger/swagger_human_resources_management.json" },
  { file: "./swagger/swagger_integrations.json" },
  { file: "./swagger/swagger_multimodule_tools.json" },
  { file: "./swagger/swagger_payments_and_printing.json" },
  { file: "./swagger/swagger_projects_and_collaborative_work.json" },
  { file: "./swagger/swagger_vendor_relationship_management.json" },
  { file: "./swagger/swagger_website_in_front_of_application.json" }
];

let modules = [];
fileModulesJSON.forEach(module => {
  modules.push(JSON.parse(fs.readFileSync(module.file, 'utf8')));
});

let paths = {};
let definitions = {};

modules.forEach(module => {
  for(const [key, value] of Object.entries(module.paths)){
    console.log(key);
  }
});


let duplicatedModule = {
  swagger: modules[0].swagger,
  host: modules[0].host,
  basePath: modules[0].basePath,
  produces: modules[0].produces,
  consumes: modules[0].consumes,
  paths,
  definitions,
  securityDefinitions: modules[0].securityDefinitions,
  info: modules[0].info
}

//console.log(duplicatedModule);
