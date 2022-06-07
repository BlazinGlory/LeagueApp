// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, net, dialog } = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const Datastore = require('nedb');
const { join } = require('path');
const dotenv = require('dotenv').config({ path: './src/.env' });
const https = require('https');
const WebSocket = require('ws');
const { RateLimiter } = require('limiter')

const httpsAgent = new https.Agent({
  //cert: fs.readFileSync("./src/riotgames.pem"),
  rejectUnauthorized: false,
});

const region = 'https://na1'

const base = ".api.riotgames.com";
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
    icon: __dirname + '/public/images/icon.png',
    x: 1230,
    y: 50,
  })

  // and load the url of the app.
  //window.loadFile('./src/public/index.html')
  // window.loadFile('./src/public/champ_pages/shyvana.html')
  window.loadFile('./src/public/matchData.html')

  // Open the DevTools.
  window.webContents.openDevTools()


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

const runes = new Datastore('src/runes.db')
runes.loadDatabase();
const favorites = new Datastore('src/favorites.db')
favorites.loadDatabase();
const matchdb = new Datastore('src/data/Matches/matchdata.db')
matchdb.loadDatabase();
const summonerdb = new Datastore('src/data/Matches/summoner.db')
summonerdb.loadDatabase();

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
  const sumurl = `${region}${base}/lol/summoner/v4/summoners/by-name/${name}`;
  const response = await fetch(sumurl, options);
  const body = await response.json();
  return body;
})

// Get values from lockfile
async function lockfile() {
  // read .env and get path
  let lockfile = await fs.promises.readFile('src/.env', 'utf8', (err, data) => {
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

// Selecting install folder
ipcMain.handle('selectFolder', async (event, arg) => {
  let result = await dialog.showOpenDialog(window, {
    title: 'Choose the LoL installation Folder',
    buttonLabel: 'Choose Folder',
    properties: ['openDirectory']
  })
  console.log('folder path selected: ', result.filePaths[0])
  process.env.PATH = result.filePaths[0];
  console.log(process.env.PATH);

  let newenv = 'KEY=' + process.env.KEY + '\n' + 'PATH=' + process.env.PATH;
  if (process.env.KEY && process.env.PATH) {
    await fs.writeFile('src/.env', newenv, (err, data) => {
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

// Call for Match Search
ipcMain.handle('matchsearch', async (event, tier, div) => {
  let result = await matchget(tier, div);
  return result
})

// Individual Match Search
ipcMain.handle('testmatch', async (event, matchid) => {
  let result = await individualMatch(matchid);
  return result
})



// Web Socket stuff idk havent even tried it yet
socket()

async function socket() {

  try {
    let lcu = await lockfile();
    let port = lcu[1];
    let password = lcu[2];

    // Create websocket & subscribe to events on startup
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
  } catch (error) {
    console.log('error in socket')
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

// get all players of rank (tier, div)
// only one page works at a time rn (204 from each tier)
async function matchget(tier, div) {

  const timer = ms => new Promise(res => setTimeout(res, ms))
    let fulltimeout = 2000;

  for (let page = 1; page < 100; page++) {

    let leagueurl = `${region}${base}/lol/league/v4/entries/RANKED_SOLO_5x5/${tier}/${div}?page=${page}`;
    let tierresponse = await fetch(leagueurl, options);
    let tierbody = await tierresponse.json();

    const timer = ms => new Promise(res => setTimeout(res, ms))
    let fulltimeout = 2000;
    let playertimeout = 1300;

    console.log('\n' + tier + ' ' + div + ' Page ' + page + ':\n')
    for (let i = 0; i < tierbody.length; i++) {
      let sumsearched = await new Promise((resolve, reject) => {
        summonerdb.count({ sumid: tierbody[i].summonerId }, function (err, result) {
          err ? reject(err) : resolve(result);
        })
      })
      console.log('Player ', i, ': searched: ', sumsearched)
      if (sumsearched == 0) {
        await timer(playertimeout)
        let val = await callmatches(i, tierbody[i].summonerId, tier, div)
        await timer(val)
        summonerdb.insert({ 'sumid': tierbody[i].summonerId })
        fulltimeout = fulltimeout + val;
      }
    }
    console.log('\n' + tier + ' ' + div + ' Page ' + page + ' completed\n')
  }
  await timer(fulltimeout);
}



// Call for last 100 matches of player
// Want to make so that filters based on version not match id
async function callmatches(i, summonerid, tier, div) {
  console.log('Player ' + i + ':')
  const sumurl = `${region}${base}/lol/summoner/v4/summoners/${summonerid}`;
  const summonerresponse = await fetch(sumurl, options);
  const summonerbody = await summonerresponse.json();
  console.log('Summoner ID: ', summonerid)
  console.log('PUUID: ', summonerbody.puuid);

  let matchurl = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${summonerbody.puuid}/ids?queue=420&count=100&startTime=1653602975`;
  let response = await fetch(matchurl, options);
  let body = await response.json();

  let filtered = []
  for (i = 0; i < body.length; i++) {
    let num = await new Promise((resolve, reject) => {
      matchdb.count({ match: parseInt(body[i].replace('NA1_', '')) }, function (err, result) {
        err ? reject(err) : resolve(result);
      })
    })
    if (num == 0) {
      filtered.push(body[i]);
    }
  }
  console.log(filtered)

  filtered.forEach((match, l) => {
    setTimeout(async () => {
      let individualMatch = `https://americas.api.riotgames.com/lol/match/v5/matches/${match}`;
      let matchresponse = await fetch(individualMatch, options);
      let body = await matchresponse.json();

      let data = {
        'match': body.info.gameId,
        'version': body.info.gameVersion,
        'region': 'NA1_',
        'tier': tier,
        'division': div,
        'info': []
      };
      for (let i = 0; i < 10; i++) {
        let runes = [body.info.participants[i].perks.styles[0].selections[0].perk, body.info.participants[i].perks.styles[0].selections[1].perk, body.info.participants[i].perks.styles[0].selections[2].perk, body.info.participants[i].perks.styles[0].selections[3].perk, body.info.participants[i].perks.styles[1].selections[0].perk, body.info.participants[i].perks.styles[1].selections[1].perk, body.info.participants[i].perks.statPerks.offense, body.info.participants[0].perks.statPerks.flex, body.info.participants[0].perks.statPerks.defense];
        let items = [body.info.participants[i].item0, body.info.participants[i].item1, body.info.participants[i].item2, body.info.participants[i].item3, body.info.participants[i].item4, body.info.participants[i].item5, body.info.participants[i].item6];

        data.info[i] = {
          'champ': body.info.participants[i].championName,
          'position': body.info.participants[i].individualPosition,
          'win': body.info.participants[i].win,
          'runes': runes,
          'items': items
        }
      }

      matchdb.find({ match: body.info.gameId }, function (err, result) {
        if (result[0]) {
          console.log('match ' + body.info.gameId + ' already in database');
        } else {
          matchdb.insert(data);
          console.log('match ' + body.info.gameId + ' added to database');
        }
      })
    }, 1300 * l)
  })
  console.log(filtered.length);
  let timeoutval = filtered.length * 1300;
  return timeoutval
}

// Call for individual match id
async function individualMatch(match) {
  let individualMatch = `https://americas.api.riotgames.com/lol/match/v5/matches/NA1_${match}`;
  let matchresponse = await fetch(individualMatch, options);
  let body = await matchresponse.json();
  return body
}