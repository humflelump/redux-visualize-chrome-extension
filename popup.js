
window.onload = function() {
  //const btn = document.getElementById('btn');
  //btn.addEventListener("click", buttonClicked);
  buttonClicked();
}

function buttonClicked() {
    console.log('clicked')
    chrome.tabs.query({active: true, currentWindow: false}, function(tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, 'GRAPH_REQUESTED')
     });
}

function renderGraph(graph) {
  //const el = document.getElementById('graph');
  //el.innerText = JSON.stringify(graph);
  console.log('window.store', window.store);
  window.store.dispatch({
    type: 'SET_GRAPH',
    graph: graph,
  });
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    if (message.type === 'GRAPH_SENT') {
      renderGraph(message.graph);
    }
  }
);