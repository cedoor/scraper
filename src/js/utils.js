const {getCurrentWindow} = require('electron').remote

const utils = {}

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
  if (dom.result.innerHTML !== '') {
    dom.result.innerHTML = ''
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
