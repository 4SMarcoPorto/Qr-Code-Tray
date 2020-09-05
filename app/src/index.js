const { app, BrowserWindow } = require('electron');
const path = require('path');

const ipc = require('electron').ipcMain;
const qrcode  = require("qrcode");

const TrayWindow = require("electron-tray-window");


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}


//render tray
app.on("ready", () => {  
  const win = new BrowserWindow({
    width: 300,
    height: 350,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false 
  })

  win.loadFile(`${path.join(__dirname, "resources/view.html")}`)

  TrayWindow.setOptions({
    trayIconPath: path.join(__dirname,"resources/assets/images/icon.png"),
    window: win,
    margin_x : -100, 
    margin_y : 30
  });
});


//Generate qrcode from string provide by ipc
async function QrCodeGenerator(string) {
  const qrCodePath = path.join(__dirname,"resources/view-engine/Qrcode.png")
  qrcode.toFile(qrCodePath, string, {
    color: {
      dark: '#64686Aff',
      light: (thememode == 'light') ? '#ffffffff' : '#1C1C1Cff'
    }
  }, function (err) {
    if (err) throw err //cant generate qrcode....return error
      console.log('[QrCode] ---- ','\x1b[32m','[OK]','\x1b[0m',', at ' + qrCodePath);
  })
}

//ipc listen runQrCodeGenerator then calls QrCodeGenerator function
ipc.on('runQrCodeGenerator', (event, args) => {
  console.log('\n \n \n')
  console.log('[String-Converted] ---- ',args);

  QrCodeGenerator(args).catch(error => console.error(error.stack));
  event.sender.send('QrCode200',true)
});

//Console logging 
ipc.on('iframeReloadSize', (event,args) =>{
  console.log('[iframeReload] ---- ','\x1b[32m','[OK]','\x1b[0m')
  console.log('[iframeSize] ---- ',"\x1b[36m [height:" + args + "]\x1b[0m")
})

//Theme mode (dark or light)
ipc.on('ThemeMode', (event,args) =>{
  if(args !== null){
    console.log('[ThemeMode] ---- ',"\x1b[36m " + args + "\x1b[0m")
    thememode = args
    QrCodeGenerator(thememode.toUpperCase() + ' mode is enable!').catch(error => console.error(error.stack));
    event.sender.send('QrCode200',true)
  }
})

//Detect IPC for quit app when user press btn close app
ipc.on('QuitApp', (event,args) =>{
  if(args) app.exit(0)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});