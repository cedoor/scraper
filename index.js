const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const {autoUpdater} = require('electron-updater')
const log = require('electron-log')

const args = process.argv.slice(1)
const dev = args.some(val => val === '--dev')

if (dev) {
  require('electron-reload')(__dirname, {})
}

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

function createMainWindow () {
  const indexPath = path.join('file://', __dirname, 'src/index.html')

  mainWindow = new BrowserWindow({
    icon: __dirname + '/resources/icons/128x128.png',
    x: 0,
    y: 0,
    width: 500,
    height: 300,
    resizable: false
  })

  mainWindow.setMenu(null)

  mainWindow.loadURL(indexPath)

  if (dev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify()
  createMainWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

