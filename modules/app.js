const fs = require('fs');

let fileModulesJSON = [
  { file: "./swagger/swagger_crm.json" },
  { file: "./swagger/swagger_debug.json" },
  { file: "./swagger/swagger_electronic_content_management.json" },
  { file: "./swagger/swagger_emails_and_social_media.json" },
  { file: "./swagger/swagger_financial.json" },
  { file: "./swagger/swagger_human_resources_management.json" },
  { file: "./swagger/swagger_integrations.json" },
  { file: "./swagger/swagger_multimode_tools.json" },
  { file: "./swagger/swagger_payments_and_printing.json" },
  { file: "./swagger/swagger_projects_and_collaborative_work.json" },
  { file: "./swagger/swagger_vendor_relationship_management.json" },
  { file: "./swagger/swagger_website_in_front_of_application.json" }
];

let modules = [];
fileModulesJSON.forEach(module => {
  modules.push(JSON.stringify(fs.readFileSync(module.file, 'utf8')));
});

console.log(modules);
