const {dialog} = require('electron').remote
const fs = require('fs')
const Xray = require('x-ray')

const xray = Xray({
  filters: {
    trim: (value) => typeof value === 'string' ? value.trim() : value,
    reverse: (value) => typeof value === 'string' ? value.split('').reverse().join('') : value,
    slice: (value, start, end) => typeof value === 'string' ? value.slice(start, end) : value,
    oneSpace: (value) => typeof value === 'string' ? value.replace(/\s\s+/g, ' ') : value,
    toNumber: (value) => typeof value === 'string' ? parseFloat(value) : value
  }
})

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

const getOutputPath = (path, fileName) => {
  return `${path.substring(0, path.lastIndexOf('/'))}/${fileName}`
}

const sanitizeSelectors = (selectors) => {
  let sanitized = false

  if (typeof selectors !== 'string') {
    for (const key in selectors) {
      if (selectors.hasOwnProperty(key)) {
        const selector = selectors[key]

        if (typeof selector !== 'string') {
          sanitized = true
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
    dom.result.innerHTML = res
    toggleLoading()
  }).catch((err) => {
    dom.result.innerHTML = 'Error: ' + err
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
      const input = JSON.parse(fs.readFileSync(files[0]).toString())
      const path = files[0]
      const promises = []
      const results = {
        ...input.header,
        websites: []
      }

      dom.result.innerHTML = ''
      toggleLoading()

      for (let website of input.websites) {
        const sanitized = sanitizeSelectors(website.selectors)

        let promise = scrape(website.url, website.scope, [website.selectors], website.options).then((res) => {
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
        fs.writeFileSync(getOutputPath(path, 'data.json'), JSON.stringify(results, null, 4))

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
