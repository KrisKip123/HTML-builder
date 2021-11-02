const fs = require('fs').promises;
const path = require('path');

const typeKB = 1024;

const fullPath = path.resolve(__dirname, 'secret-folder');

async function getFiles(){
  let allFiles = await fs.readdir(fullPath, { withFileTypes: true, });
  let filterFiles = allFiles.filter(entity => entity.isFile());
  for (let i = 0; i < filterFiles.length; i++) {
    let pathFile = path.extname(filterFiles[i].name);
    let nameFile = path.basename(filterFiles[i].name, pathFile);
    let sizeFile = (await fs.stat(path.resolve(fullPath, filterFiles[i].name))).size;
    console.log(`${nameFile} - ${pathFile.slice(1)} - ${(sizeFile/typeKB).toFixed(3)}kb`);
  }
}

getFiles();