// popup.js

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('saveAllBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'saveAllPages' });
    });
  });

  document.getElementById('stopBtn').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'stopSaving' });
    });
  });
});
