const fs = require('fs').promises;
const f = require('fs');
const path = require('path');

let pathFolderStyles = path.resolve(__dirname, 'styles');
let pathBundle = path.resolve(__dirname, 'project-dist', 'bundle.css');

async function getBundle() {
  let files = await fs.readdir(pathFolderStyles, {
    withFileTypes: true,
  });
  let filesFilter = files.filter(
    (e) => e.isFile() && e.name.slice(-3) === 'css'
  );
  let fileWriteStream = f.createWriteStream(pathBundle);
  mergeBundle(filesFilter, fileWriteStream);
}

function mergeBundle(array, fileWrite) {
  if (!array.length) {
    return fileWrite.end(console.log('Слияние потока завершено'));
  }
  let currentFile = path.resolve(pathFolderStyles, array.shift().name);
  let currentReadStream = f.createReadStream(currentFile);
  currentReadStream.pipe(fileWrite, { end: false });
  currentReadStream.on('end', function () {
    mergeBundle(array, fileWrite);
  });
  currentReadStream.on('error', function (error) {
    console.log(error);
    fileWrite.close();
  });
}

getBundle();
