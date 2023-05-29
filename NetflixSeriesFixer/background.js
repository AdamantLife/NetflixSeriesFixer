
/**
 * Extension Action Callback:
 * If we're on a Series' query (JBV query), redirect to that Series' Homepage
 * @param {Tab} tab - A browser Tab object
 */
function runFunc(tab){
    // Make sure we're on the right page
    let match = /(?<root>.*?netflix.com\/).*?\?.*?jbv=(?<titleid>\d+)/.exec(tab.url);
    if(!match?.groups?.titleid) return;
    // Redirect the Tab to the Series' Homepage (netflix.com/title/ID)
    chrome.tabs.update(tab.tabId, {url: `${match.groups.root}title/${match.groups.titleid}`})
}

chrome.action.onClicked.addListener(runFunc);