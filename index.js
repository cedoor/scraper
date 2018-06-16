const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')

const args = process.argv.slice(1)
const dev = args.some(val => val === '--dev')

if (dev) {
  require('electron-reload')(__dirname, {})
}

app.on('ready', () => {
  console.log(path.join('file://', __dirname, '/resources/icons/128x128.png'))

  let mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/resources/icons/128x128.png'),
    width: 500,
    height: 300,
    resizable: false
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(path.join('file://', __dirname, 'src/index.html'))

  if (dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

require('./updater')
