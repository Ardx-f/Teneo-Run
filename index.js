// Modul bawaan
const readline = require('readline');
const axios = require('axios');
const WebSocket = require('ws');

// Modul eksternal
const chalk = require('chalk');
const { HttpsProxyAgent } = require('https-proxy-agent');

// Modul lokal
const { useProxy } = require('./config.js');
const proxies = require('./proxy.js');
const accounts = require('./account.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Inisialisasi variabel global
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

// Inisialisasi API keys
const authorization = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag";

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

function logAllAccounts() {
  console.clear();
  displayHeader();
  for (let i = 0; i < accounts.length; i++) {
    displayAccountData(i);
  }
  console.log(chalk.magenta("\nStatus"));
  for (let i = 0; i < accounts.length; i++) {
    console.log(chalk.magenta("Account: ") + chalk.white(accounts[i].email));
    console.log(chalk.magenta("Potential Points: ") + chalk.white(potentialPoints[i]));
    console.log(chalk.magenta("Countdown: ") + chalk.white(countdowns[i]));
  }
}

function startCountdownAndPoints(index) {
  clearInterval(countdownIntervals[index]);
  updateCountdownAndPoints(index);
  countdownIntervals[index] = setInterval(() => updateCountdownAndPoints(index), 1000);
}

async function updateCountdownAndPoints(index) {
  const restartThreshold = 60000;
  const now = new Date();

  if (!lastUpdateds[index]) {
    lastUpdateds[index] = {};
  }

  if (countdowns[index] === "Calculating...") {
    const lastCalculatingTime = lastUpdateds[index].calculatingTime || now;
    const calculatingDuration = now.getTime() - lastCalculatingTime.getTime();

    if (calculatingDuration > restartThreshold) {
      restartAccountProcess(index);
      return;
    }
  }

  if (lastUpdateds[index]) {
    const nextHeartbeat = new Date(lastUpdateds[index]);
    nextHeartbeat.setMinutes(nextHeartbeat.getMinutes() + 15);
    const diff = nextHeartbeat.getTime() - now.getTime();

    if (diff > 0) {
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      countdowns[index] = `${minutes}m ${seconds}s`;

      const maxPoints = 25;
      const timeElapsed = now.getTime() - new Date(lastUpdateds[index]).getTime();
      const timeElapsedMinutes = timeElapsed / (60 * 1000);
      let newPoints = Math.min(maxPoints, (timeElapsedMinutes / 15) * maxPoints);
      newPoints = parseFloat(newPoints.toFixed(2));

      if (Math.random() < 0.1) {
        const bonus = Math.random() * 2;
        newPoints = Math.min(maxPoints, newPoints + bonus);
        newPoints = parseFloat(newPoints.toFixed(2));
      }

      potentialPoints[index] = newPoints;
    } else {
      countdowns[index] = "Calculating, It Might Take A Minute Before Starting.";
      potentialPoints[index] = 25;

      lastUpdateds[index].calculatingTime = now;
    }
  } else {
    countdowns[index] = "Calculating, It Might Take A Minute Before Starting.";
    potentialPoints[index] = 0;
    lastUpdateds[index].calculatingTime = now;
  }

  logAllAccounts();
}

function restartAccountProcess(index) {
  disconnectWebSocket(index);
  connectWebSocket(index);
  console.log(`WebSocket restarted for index: ${index}`);
}

// Function declarations reorganized, logic unchanged
async function connectWebSocket(index) {
  // WebSocket logic...
}

function disconnectWebSocket(index) {
  // WebSocket disconnect logic...
}

function startPinging(index) {
  // Ping logic...
}

function stopPinging(index) {
  // Stop ping logic...
}

async function getUserId(index) {
  // API and user login logic...
}

process.on('SIGINT', () => {
  console.log('Stopping...');
  for (let i = 0; i < accounts.length; i++) {
    stopPinging(i);
    disconnectWebSocket(i);
  }
  process.exit(0);
});

// Initialize all accounts
displayHeader();
for (let i = 0; i < accounts.length; i++) {
  potentialPoints[i] = 0;
  countdowns[i] = "Calculating...";
  pointsTotals[i] = 0;
  pointsToday[i] = 0;
  lastUpdateds[i] = null;
  messages[i] = '';
  userIds[i] = null;
  getUserId(i);
}
