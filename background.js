console.log('background running');

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 700,
        height: 500,
        top: 90,
        left: 50,
    });
  });
