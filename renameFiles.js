const fs = require('fs');
const path = require('path');

const groups = ['middlewares', 'validations'];
groups.forEach(group => {
  const dir = path.join(__dirname, 'src', group);
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    let newName = file;
    if (file.includes('Middleware.js')) {
      newName = file.replace('Middleware.js', '.middleware.js');
    } else if (file.includes('Validation.js')) {
      newName = file.replace('Validation.js', '.validation.js');
    }
    
    if (newName !== file) {
      fs.renameSync(path.join(dir, file), path.join(dir, newName));
      console.log(`Renamed ${file} to ${newName}`);
    }
  });
});
