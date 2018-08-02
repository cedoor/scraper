const {getCurrentWindow} = require('electron').remote

const utils = {}

/**
 * Scrape and return a xRay result as promise.
 * @param url
 * @param scope
 * @param selectors
 * @param options
 * @returns {Promise<any>}
 */
utils.xray = (url, scope = 'html', selectors, options) => {
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

/**
 * Show or hide the loading animation.
 * @param status
 */
utils.toggleLoading = (status) => {
  if (typeof status !== 'boolean') {
    dom.spinner.style.display = dom.spinner.style.display === 'block' ? 'none' : 'block'
  } else {
    dom.spinner.style.display = status ? 'block' : 'none'
  }
}

/**
 * Clear the JSON console.
 */
utils.clearOutput = () => {
  if (dom.output.innerHTML !== '') {
    dom.output.innerHTML = ''
    utils.toggleLoading(false)
  }
}

/**
 * Refresh the application.
 */
utils.refresh = () => {
  const currentWindow = getCurrentWindow()

  currentWindow.reload()
}
