var fs = require('fs');
var yaml = require('js-yaml');
var emailTemplateCompiler = require('../services/email-template-compiler');

var getIdFrom = function(templateFilename) {
  return templateFilename.replace(/\.yaml$/, "");
}

var isYamlFile = function(filename) {
  return /\.yaml$/.test(filename);
}

var listTemplates = function() {
  var dir = './email-templates/';
  var templates = [];
  var files = fs.readdirSync(dir).filter(isYamlFile);
  files.forEach(function(file, index, allFiles) {
    var template = yaml.safeLoad(fs.readFileSync(dir + file))
      templates.push({
        name: template.name,
        id: getIdFrom(file)
      });
  });
  return templates;
}

module.exports.routes = function(app, passport) {
  app.get('/api/v1/app/templates', function(req, res, next) {
    res.send({
      "templates": listTemplates()
    });
  });

  app.post('/api/v1/app/preview-template', function(req, res, next) {
    res.send({
      template: emailTemplateCompiler.compileTemplate(req.body.usersToEmail[0], req.body.templateId),
      result: "success"
    });
  });
}

module.exports.listTemplates = listTemplates;
