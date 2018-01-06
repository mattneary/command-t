var tabs = []

function onTab(windowId, fn) {
  chrome.tabs.query({windowId: windowId}, x => fn(windowId, x))
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

function getWindow(cb) {
  chrome.windows.getCurrent(cb)
}

function subscribe(fn) {
  const refresh = path => (...args) => {
    onTab(args[path[0]][path[1]], fn)
  }
  chrome.tabs.onCreated.addListener(refresh([0, 'windowId']))
  chrome.tabs.onUpdated.addListener(refresh([2, 'windowId']))
  chrome.tabs.onActivated.addListener(refresh([0, 'windowId']))
}
