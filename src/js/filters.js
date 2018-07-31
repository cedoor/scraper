const filters = {
  trim: (value) => typeof value === 'string' ? value.trim() : value,
  reverse: (value) => typeof value === 'string' ? value.split('').reverse().join('') : value,
  slice: (value, start, end) => typeof value === 'string' ? value.slice(start, end) : value,
  oneSpace: (value) => typeof value === 'string' ? value.replace(/\s\s+/g, ' ') : value,
  toNumber: (value) => typeof value === 'string' ? parseFloat(value) : value,
  getNumber: (value, index) => typeof value === 'string' ? parseFloat(value.match(/\d+/)[index]) : value
}