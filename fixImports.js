const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      if (file.endsWith('.js')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const allFiles = walkSync(path.join(__dirname, 'src'));

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Fix requires pointing to specific controller files
  content = content.replace(/require\(['"]\.\.?\/(?:controllers|services|routes)\/(\w+)Service['"]\)/g, "require('../services/$1.service.js')");
  content = content.replace(/require\(['"]\.\.?\/(?:controllers|services|routes)\/(\w+)Controller['"]\)/g, "require('../controllers/$1.controller.js')");
  content = content.replace(/require\(['"]\.\/(\w+)Routes(?:\.js)?['"]\)/g, "require('./$1.routes.js')");
  content = content.replace(/require\(['"]\.\/(\w+)Validation(?:\.js)?['"]\)/g, "require('./$1.validation.js')");
  content = content.replace(/require\(['"]\.\/(\w+)Middleware(?:\.js)?['"]\)/g, "require('./$1.middleware.js')");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated: ${file}`);
  }
});
