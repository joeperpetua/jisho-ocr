let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // listens for screenshot request
    if (request === 'screenshot') {
      chrome.tabs.captureVisibleTab(null, {}, function(dataUrl){
        sendResponse({imgSrc:dataUrl});
      });
      return true;
    }
  }
);



