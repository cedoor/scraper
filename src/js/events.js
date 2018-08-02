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

      editor.setValue(data, 1)

      dom.output.innerHTML = ''
    }
  }
}

dom.scrape.onclick = scrape
dom.upload.onclick = upload
dom.download.onclick = download
dom.clear.onclick = utils.clearOutput
dom.refresh.onclick = dom.noConnection.onclick = utils.refresh