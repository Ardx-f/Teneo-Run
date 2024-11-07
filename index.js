// Ardiyan Mahessa

// Modul Stock
const axios = require('axios');
const chalk = require('chalk');  // Pastikan hanya ada satu deklarasi 'chalk'
const WebSocket = require('ws');
// Modul Eksternal 
const { HttpsProxyAgent } = require('https-proxy-agent');
const readline = require('readline');
// Modul Lokal
const accounts = require('./account.js');
const proxies = require('./proxy.js');
const { useProxy } = require('./config.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// Inisialisasi Variabel Global
let sockets = [];
let pingIntervals = [];
let countdownIntervals = [];
let potentialPoints = [];
let countdowns = [];
let pointsTotals = [];
let pointsToday = [];
let lastUpdateds = [];
let messages = [];
let userIds = [];
// Insialisasi ApiKeys
const authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";
///// TAMPILAN HEADER 


function displayHeader() {
  console.log("");
  console.log(chalk.magenta.bold(`
        ______)                 _____         
       (, /                    (, /   )       
         /   _ __    _  _____    /__ /    __  
      ) /  _(/_/ (__(/_(_)    ) /   \\_(_(_/ (_
     (_/                     (_/              
  `));
  console.log(chalk.bgWhite.magenta.bold("Ardiyan Mahessa - Indropper"));
  console.log("");
}

function displayAccountData(index) {
  console.log(chalk.magentaBright(`Account ${index + 1}`));
  console.log(chalk.magentaBright(`Email: `) + chalk.white(accounts[index].email));
  console.log(chalk.magentaBright(`User ID: `) + chalk.white(userIds[index]));
  console.log(chalk.magentaBright(`Points Total: `) + chalk.white(pointsTotals[index]));
  console.log(chalk.magentaBright(`Points Today: `) + chalk.white(pointsToday[index]));
  console.log(chalk.magentaBright(`Message: `) + chalk.white(messages[index]));
  const proxy = proxies[index % proxies.length];
  if (useProxy) {
    console.log(chalk.hex('#FFA500')(`Proxy: ${proxy.host}:${proxy.port} (User: ${proxy.username})`));
  }
  console.log(chalk.red(`_____________________________________________`));
}
/// TAMPILAN FUNGSI
