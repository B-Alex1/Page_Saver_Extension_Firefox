chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'downloadFile') {
      const { content, fileName } = request;
  
      // Convert the content to a Blob
      const blob = new Blob([content], { type: 'text/html' });
  
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
  
      // Use chrome.downloads API to download the file
      chrome.downloads.download({
        url: url,
        filename: `~/Downloads/${fileName}`, // Set the default directory
        saveAs: false  // Do not prompt user for download location
      });
  
      // Revoke the Object URL to free up resources
      URL.revokeObjectURL(url);
    }
  });