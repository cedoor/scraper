const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')

const args = process.argv.slice(1)
const dev = args.some(val => val === '--dev')

if (dev) {
  require('electron-reload')(__dirname, {})
}

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    icon: path.join(__dirname, '/resources/icons/128x128.png'),
    width: 1000,
    height: 800,
    minWidth: 800,
    minHeight: 700
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
