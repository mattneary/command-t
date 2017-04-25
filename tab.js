var bg = chrome.extension.getBackgroundPage();

var _xs = null
var selectedId = 0
var query = ''

var li = (...children) => {
  var elm = document.createElement('li')
  children.forEach(c => elm.appendChild(c))
  return elm
}
var selectTab = tab => {
  bg.setActive(tab.id)
  window.close()
}
var a = (tab, i) => {
  var elm = document.createElement('div')
  elm.className = 'result'
  if (i === selectedId) elm.className += ' active'
  var span = document.createElement('span')
  span.innerText = tab.title
  elm.appendChild(span)
  elm.addEventListener('click', () => {
    selectTab(tab)
  })
  return elm
}
var result = (tab, i) => {
  return li(a(tab, i))
}

var results = document.querySelector('#results')
const render = xs => {
  _xs = xs
  results.innerHTML = ''
  xs.filter(x => {
    if (query) {
      var escapeRgx = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      var regex = new RegExp(query.split('').map(escapeRgx).join('.*'), 'i')
      return x.title.match(regex)
    }
    return true
  }).map(result).forEach(x => results.appendChild(x))
}
bg.onTab(render)

function checkKey(evt) {
  if (evt.keyCode == '38') {
    // up arrow
    selectedId -= 1
    evt.preventDefault()
  } else if (evt.keyCode == '13') {
    // enter
    selectTab(_xs[selectedId])
    evt.preventDefault()
  } else if (evt.keyCode == '40') {
    // down arrow
    selectedId += 1
    evt.preventDefault()
  } else if (evt.keyCode == '37') {
   // left arrow
  } else if (evt.keyCode == '39') {
   // right arrow
  }
  if (_xs) render(_xs)
}

document.addEventListener('keydown', checkKey, false)

var search = document.querySelector('#search')
search.addEventListener('keyup', evt => {
  query = evt.target.value
  if (_xs) render(_xs)
})

document.addEventListener('click', () => {
  search.focus()
}, false)
