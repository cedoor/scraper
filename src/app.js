const Xray = require('x-ray')
const xray = Xray()

const dom = {
  url: window.document.querySelector('#url'),
  selector: window.document.querySelector('#selector'),
  result: window.document.querySelector('#result'),
  spinner: window.document.querySelector('#spinner'),
  button: window.document.querySelector('#button')
}

const getValue = () => {
  const url = dom.url.value
  const selector = dom.selector.value

  dom.result.innerHTML = ''
  dom.spinner.style.display = 'block'

  xray(url, selector)(function (err, res) {
    if (err) {
      dom.result.innerHTML = 'Error: ' + err
    } else {
      dom.result.innerHTML = res
    }

    dom.spinner.style.display = 'none'
  })
}

window.onkeydown = (event) => {
  if (event.code === 'Enter') {
    getValue()
  }
}

dom.button.onclick = getValue