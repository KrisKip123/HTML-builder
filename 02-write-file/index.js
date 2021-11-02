const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePosition = path.resolve(__dirname, 'text.txt');

fs.open(filePosition, 'w', (err) => {
  if (err) throw err;
  console.log('Введите текст: ');
  text.prompt();
});

const text = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

text.addListener('line', (data) => {
  if (data === 'exit') {
    exitWarning();
  } else {
    fs.appendFile(filePosition, `\n${data}`, (err) => {
      if (err) throw err;
    });
    goNext();
  }
});

function goNext() {
  console.log('Что-то ещё(Введите exit или комбинацию клавишь Ctrl + C, чтобы выйти):');
  text.prompt();
}

text.addListener('SIGINT', () => {
  exitWarning();
});

function exitWarning() {
  console.log('Good Bye');
  text.close();
}
