window.onkeydown = (event) => {
  if (event.code === 'Enter') {
    getValue()
  }
}

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

dom.button.onclick = getValue
dom.upload.onclick = uploadFile
dom.download.onclick = downloadFile
dom.clear.onclick = utils.clearOutput
dom.refresh.onclick = dom.noConnection.onclick = utils.refresh