const fs = require('fs').promises;
const path = require('path');
const f = require('fs');

let fullNamePath = path.resolve(__dirname, 'files');
let copyFullNamePath = path.resolve(__dirname, 'files-copy');


async function checkFolder(){
  let FOLDER = await fs.readdir(path.resolve(__dirname),{
    withFileTypes:true,
  });
  let t = 0;
  FOLDER.forEach(e => {
    if(e.name === 'files-copy'){
      t++;
    }
  });
  if(t === 1){
    await fs.rm(path.resolve(__dirname, 'files-copy'), {recursive: true});
  }
}

async function copyDir () {
  await checkFolder();
  await fs.mkdir(copyFullNamePath, { recursive: true });
  let files = await fs.readdir(fullNamePath, {
    withFileTypes: true,
  });
  let filesFilter = files.filter((e) => e.isFile());
  for (let i = 0; i < filesFilter.length; i++) {
    let backPath = await path.resolve(fullNamePath, filesFilter[i].name);
    let newPath = await path.resolve(copyFullNamePath, filesFilter[i].name);
    let backStream;
    if(filesFilter[i].name.slice(-3) === 'jpg'){
      backStream = await f.createReadStream(backPath);
    }else{
      backStream = await f.createReadStream(backPath, 'utf8');
    }
    let newStream = await f.createWriteStream(newPath);
    await backStream.pipe(newStream);
  }
}

copyDir ();
