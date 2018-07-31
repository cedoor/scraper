const {dialog} = require('electron').remote
const fs = require('fs')
const Xray = require('x-ray')
const JSONFormatter = require('json-formatter-js').default

const xray = Xray({filters})

// Internet connection check
if (window.navigator.onLine === false) {
  dom.content.style.display = 'none'
  dom.noConnection.style.display = 'block'
}

let results = ''

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

          if (selector.scope) {
            selector.selectors = xray(selector.scope, selector.selectors)
          }

          if (selector.url) {
            selectors[key] = xray(selector.url, selector.selectors)
          } else {
            selectors[key] = xray(selector.selectors)
          }
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
  utils.toggleLoading()

  scrape(url, null, selector).then((res) => {
    results = res

    dom.result.innerHTML = res
    utils.toggleLoading()
  }).catch((err) => {
    dom.result.innerHTML = 'Error: ' + err
    utils.toggleLoading()
  })
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
      utils.toggleLoading()

      for (let website of input.websites) {
        const sanitized = sanitizeSelectors(website.selectors)

        let promise = scrape(website.url, website.scope, website.selectors, website.options).then((res) => {
          delete website.scope
          delete website.selectors
          delete website.options

          if (sanitized && Array.isArray(res)) {
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

        utils.toggleLoading()
      })
    }
  })
}