const fs = require('fs');

let fileModulesJSON = [
  { file: "./swagger/swagger_crm.json", name: "swagger_crm.json" },
  { file: "./swagger/swagger_debug.json", name: "swagger_debug.json" },
  { file: "./swagger/swagger_electronic_content_management.json", name: "swagger_electronic_content_management.json" },
  { file: "./swagger/swagger_emails_and_social_media.json", name: "swagger_emails_and_social_media.json" },
  { file: "./swagger/swagger_financial.json", name: "swagger_financial.json" },
  { file: "./swagger/swagger_human_resources_management.json", name: "swagger_human_resources_management.json" },
  { file: "./swagger/swagger_integrations.json", name: "swagger_integrations.json" },
  { file: "./swagger/swagger_multimodule_tools.json", name: "swagger_multimodule_tools.json" },
  { file: "./swagger/swagger_payments_and_printing.json", name: "swagger_payments_and_printing.json" },
  { file: "./swagger/swagger_projects_and_collaborative_work.json", name: "swagger_projects_and_collaborative_work.json" },
  { file: "./swagger/swagger_vendor_relationship_management.json", name: "swagger_vendor_relationship_management.json" },
  { file: "./swagger/swagger_website_in_front_of_application.json", name: "swagger_website_in_front_of_application.json" }
];

let modules = [];
fileModulesJSON.forEach(module => {
  modules.push({
    file: JSON.parse(fs.readFileSync(module.file, 'utf8')),
    name: module.name
  });
});

let paths = {};
let definitions = {};

modules.forEach(module => {
  for(const [key, value] of Object.entries(module.file.paths)){
    if(paths[key] == undefined){
      paths[key] = value;
      paths[key].from = [module.name];
    }else{
      paths[key].from.push(module.name);
    }
  }
});

function getModuleByName(name){
  for(let i = 0, j = modules.length; i < j; i++){
    if(modules[i].name == name){
      return modules[i];
    }
  }
}

//delete duplicate paths from files
for(const [key, value] of Object.entries(paths)){
  if(paths[key].from.length == 1){
    delete paths[key];
  }else{
    paths[key].from.forEach(from => {
      let mod = getModuleByName(from);
      delete mod.file.paths[key];
    });
  }
}

modules.forEach(module => {
  for(const [key, value] of Object.entries(module.file.definitions)){
    if(definitions[key] == undefined){
      definitions[key] = value;
      definitions[key].from = [module.name];
    }else{
      definitions[key].from.push(module.name);
    }
  }
});

//delete duplicate definitions from files
for(const [key, value] of Object.entries(definitions)){
  if(definitions[key].from.length == 1){
    delete definitions[key];
  }else{
    definitions[key].from.forEach(from => {
      let mod = getModuleByName(from);
      delete mod.file.definitions[key];
    });
  }
}

let duplicatedModule = {
  swagger: modules[0].file.swagger,
  host: modules[0].file.host,
  basePath: modules[0].file.basePath,
  produces: modules[0].file.produces,
  consumes: modules[0].file.consumes,
  paths,
  definitions,
  securityDefinitions: modules[0].file.securityDefinitions,
  info: modules[0].file.info
}

let filename = "duplicates.json";
fs.writeFile(`${__dirname}/output/${filename}`, JSON.stringify(duplicatedModule), err => {
    if (err) {
        console.error(err)
        return;
    }
    let numModules = modules.length;
    let count = -1;

    modules.forEach(module => {
      fs.writeFile(`${__dirname}/modified/${module.name}`, JSON.stringify(module.file), err => {
        checkComplete();
      });
    });

    checkComplete();

    function checkComplete(){
      count++;
      if(count == numModules){
        console.log("success");
      }
    }
});
