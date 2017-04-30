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
  const refresh = () => onTab(fn)
  chrome.tabs.onCreated.addListener(refresh)
  chrome.tabs.onUpdated.addListener(refresh)
  chrome.tabs.onActivated.addListener(refresh)
}
