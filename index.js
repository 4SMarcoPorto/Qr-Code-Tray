require('update-electron-app')()

const ipc = require('electron').ipcMain;
const qrcode  = require("qrcode");
const path = require("path");

const TrayWindow = require("electron-tray-window");
const { app  } = require("electron");


//render tray
app.on("ready", () => {
  TrayWindow.setOptions({
    trayIconPath: path.join("resources/assets/images/icon.png"),
    windowUrl: `file://${path.join(__dirname, "resources/view.html")}`,
    width:300,
    height:350,
    margin_x : -100, 
    margin_y : 30
  });
});

//Generate qrcode from string provide by ipc
async function QrCodeGenerator(string) {
  const qrCodePath = path.join("resources/view-engine/Qrcode.png")
  qrcode.toFile(qrCodePath, string, {
    color: {
      dark: '#C3C6C8ff',
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

ipc.on('iframeReloadSize', (event,args) =>{
  console.log('[iframeReload] ---- ','\x1b[32m','[OK]','\x1b[0m')
  console.log('[iframeSize] ---- ',"\x1b[36m [height:" + args + "]\x1b[0m")
})

ipc.on('ThemeMode', (event,args) =>{
  if(args !== null){
    console.log('[ThemeMode] ---- ',"\x1b[36m " + args + "\x1b[0m")
    thememode = args
    QrCodeGenerator(thememode.toUpperCase() + ' mode is enable!').catch(error => console.error(error.stack));
    event.sender.send('QrCode200',true)
  }
})


