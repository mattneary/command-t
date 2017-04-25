var tabs = []
var loadTabs = () => null
function onTab(fn) {
  loadTabs = fn
  chrome.tabs.query({}, fn)
}
function setActive(tabId) {
  console.log('active', tabId)
  chrome.tabs.update(tabId, {selected: true})
}

chrome.tabs.onCreated.addListener(function (tab) {
  onTab(loadTabs)
})

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  onTab(loadTabs)
})

chrome.tabs.onActivated.addListener(function (info) {
  onTab(loadTabs)
})
