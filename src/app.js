const {dialog} = require('electron').remote
const fs = require('fs')
const Xray = require('x-ray')

const xray = Xray()

const dom = {
  url: window.document.querySelector('#url'),
  selector: window.document.querySelector('#selector'),
  result: window.document.querySelector('#result'),
  spinner: window.document.querySelector('#spinner'),
  button: window.document.querySelector('#button'),
  upload: window.document.querySelector('#upload')
}

const toggleLoading = () => {
  dom.spinner.style.display = dom.spinner.style.display === 'block' ? 'none' : 'block'
}

const getValue = () => {
  const url = dom.url.value
  const selector = dom.selector.value

  dom.result.innerHTML = ''
  toggleLoading()

  xray(url, selector)((err, res) => {
    if (err) {
      dom.result.innerHTML = 'Error: ' + err
    } else {
      dom.result.innerHTML = res
    }

    toggleLoading()
  })
}

const uploadFile = () => {
  dialog.showOpenDialog({
    title: 'Open file',
    properties: ['openFile'],
    filters: [{
      name: 'Json file',
      extensions: ['json']
    }, {
      name: 'All files',
      extensions: ['*']
    }]
  }, (files) => {
    if (files) {
      const data = JSON.parse(fs.readFileSync(files[0]).toString())
      const path = files[0]

      dom.result.innerHTML = ''
      toggleLoading()

      xray(data[0].url, data[0].scope, [data[0].selectors])((err, res) => {
        if (err) {
          dom.result.innerHTML = 'Error: ' + err
        } else {
          fs.writeFileSync(path.substring(0, path.lastIndexOf('/')) + '/output.json', JSON.stringify(res))
        }

        toggleLoading()
      })
    }
  })
}

window.onkeydown = (event) => {
  if (event.code === 'Enter') {
    getValue()
  }
}

dom.button.onclick = getValue
dom.upload.onclick = uploadFile
