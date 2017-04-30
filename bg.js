var tabs = []

function onTab(fn) {
  chrome.tabs.query({currentWindow: true}, fn)
}

function setActive(tabId) {
  chrome.tabs.update(tabId, {selected: true})
}

function closeTab(tabId) {
  chrome.tabs.remove(tabId)
}

function openLink(link) {
  chrome.tabs.create({url: link, active: false})
}

function subscribe(fn) {
  const refresh = (value, path) => (...args) => {
    if (args[path[0]][path[1]] === value) onTab(fn)
  }
  chrome.windows.getCurrent(currentWindow => {
    chrome.tabs.onCreated.addListener(refresh(currentWindow.id, [0, 'windowId']))
    chrome.tabs.onUpdated.addListener(refresh(currentWindow.id, [2, 'windowId']))
    chrome.tabs.onActivated.addListener(refresh(currentWindow.id, [0, 'windowId']))
  })
}
