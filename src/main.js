// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, net, dialog } = require('electron');
const path = require('path');
const { isMainThread } = require('worker_threads');
const fetch = require('node-fetch');
const fs = require('fs');
const Datastore = require('nedb');
const { join } = require('path');
const dotenv = require('dotenv').config();
const https = require('https');
const { createServer } = require('http');
const WebSocket = require('ws');

const httpsAgent = new https.Agent({
  //cert: fs.readFileSync("src/riotgames.pem"),
  rejectUnauthorized: false,
});

const base = "https://na1.api.riotgames.com";
let key = process.env.KEY;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const options = {
  "method": "get",
  "muteHttpExceptions": true,
  "headers": {
    "X-Riot-Token": key,
  }
};

let window;

function createWindow() {
  // Create the browser window.
  window = new BrowserWindow({
    width: 660,
    height: 900,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    useContentSize: true,
    autoHideMenuBar: true,
    backgroundColor: '#FFF',
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },

    x: 1230,
    y: 50,
  })

  // and load the url of the app.
  window.loadFile('./src/public/index.html')

  // window.loadFile('./src/public/champ_pages/shyvana.html')

  // Open the DevTools.
  window.webContents.openDevTools()
  // Set Zoom Factor
  window.webContents.setZoomFactor(1.0);
}

// This method will be called when Electron has finished initialization and is ready to create browser windows. Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()

    // choose folder
    dialog.showOpenDialog({
      title: "Select a folder",
      properties: ["openDirectory"]
    }, (folderPaths) => {
      // folderPaths is an array that contains all the selected paths
      if (fileNames === undefined) {
        console.log("No destination folder selected");
        return;
      } else {
        console.log(folderPaths);
      }
    });

  })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.commandLine.appendSwitch('force-device-scale-factor', 1)

const runes = new Datastore('src/runes.db')
runes.loadDatabase();
const favorites = new Datastore('src/favorites.db')
favorites.loadDatabase();

// Get runes from database
ipcMain.handle('getrunes', async (event, champ) => {
  return new Promise((resolve, reject) => {
    runes.find({ champion: champ }).sort({ timestamp: 1 }).exec((err, data) => {
      err ? reject(err) : resolve(data);
    })
  });
});

// Save runes to database
ipcMain.handle('saverunes', async (event, rune) => {
  const savetime = Date.now();
  rune.timestamp = savetime;
  runes.insert(rune);
  return;
})
// Send favorite champ to database
ipcMain.handle('favorite', async (event, champ) => {
  const favtime = Date.now();
  champ.timestamp = favtime;
  favorites.insert(champ);
  return;
})


// Custom Titlebar buttons
ipcMain.on('minimize', () => {
  window.minimize();
})
ipcMain.on('maximize', () => {
  if (window.isMaximized()) {
    window.unmaximize();
  } else {
    window.maximize();
  }
})
ipcMain.on('close', () => {
  app.quit();
})

// Local API calls

// Call League API for summoner id 
ipcMain.handle('name', async (event, name) => {
  const sumurl = `${base}/lol/summoner/v4/summoners/by-name/${name}`;
  const response = await fetch(sumurl, options);
  const body = await response.json();
  return body;
})

// Get values from lockfile
async function lockfile() {
  let lockfile = await fs.promises.readFile('.env', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    return data;
  });
  let path = lockfile.split('\n')[1].split('=')[1];
  try {
    let lockfile = await fs.promises.readFile(join(path + '\\lockfile'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
      return data;
    });
    let values = lockfile.split(':').slice(1);
    return values;
  }
  catch {
    console.log('lockfile does not exist in specified directory. Is the game open?');
  }
}
// Send values of lockfile to client
ipcMain.handle('lcuvalues', async () => {
  let lcuValues = await lockfile();
  return lcuValues;
})

// LCU Test Call (summoner name, xp, icon, etc)
ipcMain.handle('lcuinfo', async () => {
  let lcu = await lockfile();
  console.log(lcu);
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  const optionsLcu = {
    method: "get",
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      "Authorization": auth,
    }
  };
  let baseLcu = "https://127.0.0.1:" + port;

  let url = baseLcu + "/lol-summoner/v1/current-summoner";
  let response = await fetch(url, optionsLcu);
  let json = await response.json(response);
  return json;
})

// LCU Set Icon
ipcMain.handle('seticon', async (event, icon) => {
  let lcu = await lockfile();
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  const optionsLcu = {
    method: 'put',
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      Authorization: auth,
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      inventoryToken: "string",
      profileIconId: icon
    })
  };
  let baseLcu = "https://127.0.0.1:" + port;

  let url = baseLcu + "/lol-summoner/v1/current-summoner/icon";
  let response = await fetch(url, optionsLcu);
  let json = await response.json(response);
  return json;
})

// LCU get current rune page
ipcMain.handle('runepage', async () => {
  let lcu = await lockfile();
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  const optionsLcu = {
    method: "get",
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      "Authorization": auth,
    }
  };
  let baseLcu = "https://127.0.0.1:" + port;

  let url = baseLcu + "/lol-perks/v1/currentpage";
  let response = await fetch(url, optionsLcu);
  let json = await response.json(response);
  return json;
})

// Delete rune page from client
ipcMain.handle('deleteRune', async (event, id) => {
  let lcu = await lockfile();
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  let baseLcu = "https://127.0.0.1:" + port;
  const optionsLcu = {
    method: "delete",
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      Authorization: auth,
    }
  };
  url = baseLcu + "/lol-perks/v1/pages/" + id;
  let response = await fetch(url, optionsLcu);
  return response;
})

// Add new rune page to client
ipcMain.handle('newpage', async (event, rune) => {
  let lcu = await lockfile();
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  let baseLcu = "https://127.0.0.1:" + port;
  const optionsLcu = {
    method: "post",
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      'accept': 'application/json',
      "Authorization": auth,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rune)
  };
  url = baseLcu + "/lol-perks/v1/pages";
  let response = await fetch(url, optionsLcu);
  let json = await response.json(response);
  return json;
})

// Save rune page from client
ipcMain.handle('saveclient', async (event, champ) => {
  let lcu = await lockfile();
  let port = lcu[1];
  let password = lcu[2];
  const auth = "Basic " + btoa("riot:" + password);
  const optionsLcu = {
    method: "get",
    muteHttpExceptions: true,
    agent: httpsAgent,
    headers: {
      "Authorization": auth,
    }
  };
  let baseLcu = "https://127.0.0.1:" + port;

  let url = baseLcu + "/lol-perks/v1/currentpage";
  let response = await fetch(url, optionsLcu);
  let json = await response.json(response);
  json.champion = champ;
  const savetime = Date.now();
  json.timestamp = savetime;
  runes.insert(json);
  console.log(json.name + ' saved');
  return json;
})

// Delete runes from database
ipcMain.handle('deletepage', async (event, champ, runenum) => {
  return new Promise((resolve, reject) => {
    runes.remove({ id: Number(runenum), champion: champ }, (err, data) => {
      err ? reject(err) : resolve(data);
    })
  });
});

// Call for champroles
ipcMain.handle('champroles', async () => {
  const all = await champroles();
  return all
})

// Call for champions.csv
ipcMain.handle('allcsv', async () => {
  const all = await champcsv();
  return all
})

ipcMain.handle('selectFolder', async (event, arg) => {
  let result = await dialog.showOpenDialog(window, {
    title: 'Choose the LoL installation Folder',
    buttonLabel: 'Choose Folder',
    properties: ['openDirectory']
  })
  console.log('folder path selected: ', result.filePaths[0])
  process.env.PATH = result.filePaths[0];
  console.log(process.env.PATH);

  let newenv = 'KEY='+process.env.KEY+'\n'+'PATH='+process.env.PATH;
  if (process.env.KEY && process.env.PATH) {
    await fs.writeFile('.env', newenv, (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log('.env file saved successfully');
      }
    })
  } else {
    console.log('.env file failed to save');
  }
  return result
})



// Web Socket stuff idk havent even tried it yet
socket()

async function socket() {
  try {
    let lcu = await lockfile();
    let port = lcu[1];
    let password = lcu[2];
  } catch (error) {
    console.log('pulling lockfile values failed')
  }

  // Create websocket & subscribe to events on startup
  try {
    const ws = new RiotWSProtocol(`wss://riot:${password}@localhost:${port}/`);

    ws.on('open', () => {
      console.log('Websocket connected');
      //.subscribe('OnJsonApiEvent', console.log);
      // Listen for selected champ
      ws.subscribe('OnJsonApiEvent_lol-champ-select_v1_current-champion', (currentchamp) => {
        ;
        // Find when champion selected, load page & runes
        if (currentchamp.eventType !== 'Delete') {
          let id = currentchamp.data;
          let currentname = championroles[id][0].Name;
          console.log(currentname);
          window.loadFile('./src/public/champ_pages/' + currentname + '.html')
        }
      });
    });
  } catch {
    console.log('could not connect to websocket')
  }
}

// Defines actions in websocket
class RiotWSProtocol extends WebSocket {
  constructor(url) {
    super(url, 'wamp');
    this.session = null;
    this.on('message', this._onMessage.bind(this));
  }
  close() {
    super.close();
    this.session = null;
  }
  terminate() {
    super.terminate();
    this.session = null;
  }
  subscribe(topic, callback) {
    super.addListener(topic, callback);
    this.send(5, topic);
  }
  unsubscribe(topic, callback) {
    super.removeListener(topic, callback);
    this.send(6, topic);
  }
  send(type, message) {
    super.send(JSON.stringify([type, message]));
  }
  _onMessage(message) {
    const [type, ...data] = JSON.parse(message);
    switch (type) {
      case 0:
        this.session = data[0];
        // this.protocolVersion = data[1];
        // this.details = data[2];
        break;
      case 3:
        console.log('Unknown call, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
        break;
      case 4:
        console.log('Unknown call error, if you see this file an issue at https://discord.gg/hPtrMcx with the following data:', data);
        break;
      case 8:
        const [topic, payload] = data;
        this.emit(topic, payload);
        break;
      default:
        console.log('Unknown type, if you see this file an issue with at https://discord.gg/hPtrMcx with the following data:', [type, data]);
        break;
    }
  }
}

// Gets champion data by name in ddragon
async function champdata() {
  try {
    let champdata = await fs.promises.readFile('./src/data/champion.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data;
    });
    let values = JSON.parse(champdata);
    return values;
  } catch (error) {
    console.log('error parsing champion.json')
  }

}

// Gets champion name and roles by id
// Use this website https://www.convertcsv.com/csv-to-json.htm to convert champ csv data to file.
async function champroles() {
  try {
    let champdata = await fs.promises.readFile('./src/data/convertcsv.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data;
    });
    let values = JSON.parse(champdata);
    let roledata = [];
    for (let key in values) {
      roledata[key] = values[key][0];
    }
    return roledata;
  } catch (error) {
    console.log('error parsing convertcsv.json')
  }

}

async function champcsv() {
  try {
    let data = await fs.promises.readFile('./src/data/champions.csv', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      return data
    });
    let rows = data.split('\n').slice(1);
    let ids = [];
    let names = [];
    rows.forEach(row => {
      let column = row.split(',');
      let champid = column[0];
      ids.push(champid);
      let champname = column[1];
      names.push(champname);
    })
    ids.splice(159);
    names.splice(159);
    let csv = [ids, names];
    return csv;
  } catch (error) {
    console.log('error parsing champions.csv')
  }

};
