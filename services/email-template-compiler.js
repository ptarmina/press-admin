var yaml = require('js-yaml');
var fs = require('fs');

var compileTemplate = function(user, templateName) {
  var path = "./email-templates/" + templateName + ".yaml"
  var template = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  return {
    "toState": template.to_state,
    "name": template.name,
    "subject": fillParameters(user, template.subject),
    "body": fillParameters(user, template.body)
  }
}

var fillParameters = function(user, string) {
  return string.replace(/#{.+?}/g, function(match) { 
    return user[stripInterpolationMarkers(match)]
  });
}

var stripInterpolationMarkers = function(string) {
  return string.substring(2, string.length - 1);
}

module.exports.compileTemplate = compileTemplate;
