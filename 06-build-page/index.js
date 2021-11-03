const fs = require('fs').promises;
const f = require('fs');
const path = require('path');

let pathFolderAssets = path.resolve(__dirname, 'assets');
let pathFolderNewFolder = path.resolve(__dirname, 'project-dist');
let pathFolderStyles = path.resolve(__dirname, 'styles');
let pathNewStyle = path.resolve(pathFolderNewFolder, 'style.css');
let pathTemplate = path.resolve(__dirname, 'template.html');
let pathComponents = path.resolve(__dirname, 'components');
let pathCreateAssets = path.resolve(pathFolderNewFolder, 'assets');

async function createFolder(pathFolderCreate, newPath = '') {
  let newPathFolder = path.resolve(pathFolderCreate, newPath);
  await fs.mkdir(newPathFolder, { recursive: true });
}

async function getCloneAssets() {
  await createFolder(pathFolderNewFolder);
  await createFolder(pathCreateAssets);
  let assetsFolder = await fs.readdir(pathFolderAssets, {
    withFileTypes: true,
  });
  let currentArray = [];
  let newArray = [];
  for (let i = 0; i < assetsFolder.length; i++) {
    await createFolder(pathCreateAssets, assetsFolder[i].name);
    let currentFolder = path.resolve(pathFolderAssets, assetsFolder[i].name);
    let newFolder = path.resolve(pathCreateAssets, assetsFolder[i].name);
    newArray.push(newFolder);
    currentArray.push(currentFolder);
  }
  getFile(currentArray, newArray);
}

async function getFile(currentPath, newPath) {
  if (!currentPath.length) {
    return false;
  }
  let newPathFolder = newPath.pop();
  let currentPathFolder = currentPath.pop();
  let files = await fs.readdir(currentPathFolder, {
    withFileTypes: true,
  });
  files.forEach((file) => {
    let currentPathFile = path.resolve(currentPathFolder, file.name);
    let newPathFile = path.resolve(newPathFolder, file.name);
    let currentStream;
    if (files[0].name.slice(-3) === 'jpg') {
      currentStream = f.createReadStream(currentPathFile);
    } else {
      currentStream = f.createReadStream(currentPathFile, 'utf8');
    }
    let newStream = f.createWriteStream(newPathFile);
    currentStream.pipe(newStream);
  });
  getFile(currentPath, newPath);
}

async function getBundle() {
  let files = await fs.readdir(pathFolderStyles, {
    withFileTypes: true,
  });
  let fileWriteStream = f.createWriteStream(pathNewStyle);
  mergeBundle(files, fileWriteStream);
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

async function getHtml() {
  let tHtml = await fs.readFile(pathTemplate, 'utf8');
  let files = await fs.readdir(pathComponents, {
    withFileTypes: true,
  });
  files = files.map((e) => path.basename(e.name, '.html'));
  let data = [];
  for (let i = 0; i < files.length; i++) {
    let PathFile = path.resolve(pathComponents, `${files[i]}.html`);
    let readFile = await fs.readFile(PathFile);
    data.push(readFile);
  }
  let newHTML = tHtml;
  for (let i = 0; i < files.length; i++) {
    newHTML = newHTML.replace(`{{${files[i]}}}`, data[i]);
  }
  fs.writeFile(path.resolve(pathFolderNewFolder, 'index.html'), newHTML);
}

async function start() {
  await getCloneAssets();
  await getBundle();
  await getHtml();
}
start();
