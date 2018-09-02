
function passGraphRequestToPage(request, sender, sendResponse) {
    if (request === 'GRAPH_REQUESTED') {
        window.postMessage(request, '*')
    }  
}
chrome.runtime.onMessage.addListener(passGraphRequestToPage);

function passGraphResponseToPopup(message) {
    chrome.runtime.sendMessage(message);
}

window.addEventListener('message', function(event) {
    if (event.data.type === 'GRAPH_SENT') {
        passGraphResponseToPopup(event.data);
    }
});
