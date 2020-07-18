const ipc = require('electron').ipcRenderer;

const input = document.querySelector('#input');
const iframe_qrcode = document.querySelector('#iframeqrcode');

//When user press a key inside textarea, IPC send a message to index.js and run QrCodeGenerator function
input.addEventListener('change', () => {
    if(input.value != " " && input.value != "" && input.value.length <= 250){
        ipc.send('runQrCodeGenerator',input.value)
    }
});

//Index.js IPC return a message and render catch that message and reload frame to update qrcode img
ipc.on('QrCode200', (event,args) => {
    if(args){iframe_qrcode.contentDocument.location.reload(true)}
});

iframe_qrcode.addEventListener('load', () => {
    iframe_qrcode.style.height = iframe_qrcode.contentWindow.document.body.scrollHeight + 50 + 'px';
    ipc.send('iframeReloadSize',iframe_qrcode.style.height)
});
