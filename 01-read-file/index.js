const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.resolve(__dirname, 'text.txt'), {
    encoding: 'utf8',
});


stream.on('data',(text) => console.log(text) );