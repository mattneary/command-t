var tabs = []
var loadTabs = () => null

function onTab(fn) {
  loadTabs = fn
  chrome.tabs.query({}, fn)
}

function setActive(tabId) {
  chrome.tabs.update(tabId, {selected: true})
}

function closeTab(tabId) {
  chrome.tabs.remove(tabId)
}

const refresh = () => onTab(loadTabs)
chrome.tabs.onCreated.addListener(refresh)
chrome.tabs.onUpdated.addListener(refresh)
chrome.tabs.onActivated.addListener(refresh)
