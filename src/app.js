const {dialog, getCurrentWindow} = require('electron').remote
const fs = require('fs')
const Xray = require('x-ray')
const JSONFormatter = require('json-formatter-js').default

const xray = Xray({
  filters: {
    trim: (value) => typeof value === 'string' ? value.trim() : value,
    reverse: (value) => typeof value === 'string' ? value.split('').reverse().join('') : value,
    slice: (value, start, end) => typeof value === 'string' ? value.slice(start, end) : value,
    oneSpace: (value) => typeof value === 'string' ? value.replace(/\s\s+/g, ' ') : value,
    toNumber: (value) => typeof value === 'string' ? parseFloat(value) : value,
    getNumber: (value, index) => typeof value === 'string' ? parseFloat(value.match(/\d+/)[index]) : value
  }
})

const dom = {
  content: window.document.querySelector('#content'),
  noConnection: window.document.querySelector('#no-connection'),
  url: window.document.querySelector('#url'),
  selector: window.document.querySelector('#selector'),
  result: window.document.querySelector('#result'),
  spinner: window.document.querySelector('#spinner'),
  button: window.document.querySelector('#button'),
  upload: window.document.querySelector('#upload'),
  download: window.document.querySelector('#download'),
  clear: window.document.querySelector('#clear'),
  refresh: window.document.querySelector('#refresh')
}

// Internet connection check
if (window.navigator.onLine === false) {
  dom.content.style.display = 'none'
  dom.noConnection.style.display = 'block'
}

let results = ''

const toggleLoading = (status) => {
  if (typeof status !== 'boolean') {
    dom.spinner.style.display = dom.spinner.style.display === 'block' ? 'none' : 'block'
  } else {
    dom.spinner.style.display = status ? 'block' : 'none'
  }
}

const sanitizeSelectors = (selectors) => {
  let sanitized = false

  if (Array.isArray(selectors)) {
    selectors = selectors[0]
  }

  if (typeof selectors !== 'string') {
    for (const key in selectors) {
      if (selectors.hasOwnProperty(key)) {
        const selector = selectors[key]

        if (typeof selector !== 'string' && !Array.isArray(selector)) {
          sanitized = true
          sanitizeSelectors(selector.selectors)

          selectors[key] = xray(selector.url, selector.selectors)
        }
      }
    }
  }

  return sanitized
}

const scrape = (url, scope = 'html', selectors, options) => {
  return new Promise((resolve, reject) => {
    const query = xray(url, scope, selectors)

    if (options && options.pagination) {
      query
        .paginate(options.pagination)
        .limit(options.limit)
    }

    query((err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

const getValue = () => {
  const url = dom.url.value
  const selector = dom.selector.value

  dom.result.innerHTML = ''
  toggleLoading()

  scrape(url, null, selector).then((res) => {
    results = res

    dom.result.innerHTML = res
    toggleLoading()
  }).catch((err) => {
    dom.result.innerHTML = 'Error: ' + err
    toggleLoading()
  })
}

const clearOutput = () => {
  if (dom.result.innerHTML !== '') {
    dom.result.innerHTML = ''
    toggleLoading(false)
  }
}

const refresh = () => {
  const currentWindow = getCurrentWindow()

  currentWindow.reload()
}

const dragAndDropListener = () => {
  window.document.ondragover = window.document.ondrop = (event) => {
    event.preventDefault()
  }

  window.document.body.ondrop = (event) => {
    event.preventDefault()

    let files = event.dataTransfer.files

    if (files.length > 0) {
      const url = files[0].path
      let extension = url.split('.').pop()

      if (extension === 'json') {
        const data = fs.readFileSync(url).toString()
        const formatter = new JSONFormatter(JSON.parse(data))

        dom.result.innerHTML = ''

        dom.result.appendChild(formatter.render())

        formatter.openAtDepth(10)
      }
    }
  }
}

const downloadFile = () => {
  dialog.showSaveDialog({
    title: 'Save file',
    defaultPath: 'data.json'
  }, (path) => {
    if (typeof path === 'string') {
      if (typeof results === 'string') {
        results = {results}
      }

      fs.writeFileSync(path, JSON.stringify(results, null, 4))
    }
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
      const input = JSON.parse(fs.readFileSync(files[0]).toString())
      const promises = []

      results = {
        ...input.header,
        websites: []
      }

      dom.result.innerHTML = ''
      toggleLoading()

      for (let website of input.websites) {
        const sanitized = sanitizeSelectors(website.selectors)

        let promise = scrape(website.url, website.scope, website.selectors, website.options).then((res) => {
          delete website.scope
          delete website.selectors
          delete website.options

          if (sanitized) {
            res.shift()
          }

          const result = website
          result.results = res

          results.websites.push(result)
        }).catch((err) => {
          console.error(err)
        })

        promises.push(promise)
      }

      Promise.all(promises).then(() => {
        const formatter = new JSONFormatter(results)

        dom.result.appendChild(formatter.render())

        formatter.openAtDepth(10)

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
dom.download.onclick = downloadFile
dom.clear.onclick = clearOutput
dom.refresh.onclick = dom.noConnection.onclick = refresh

dragAndDropListener()
