// content.js

let currentPageIndex = 0; // Track the current page index
let stopSaving = false; // Flag to stop saving pages

// Function to save HTML content to a file
function saveToFile(content, fileName) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to navigate through pages and save HTML
async function saveAllPages(filenamePattern, numPages) {
  const nextButton = document.querySelector('.btn-next');

  // Recursive function to save pages
  async function savePagesRecursively() {
    if (!stopSaving && currentPageIndex < numPages) {
      // Save the HTML content of the current page before clicking the next page button
      saveHTML(filenamePattern);

      // Simulate clicking the next page button
      nextButton.click();

      // Wait for some time (adjust as needed) to allow content to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      currentPageIndex++;

      // Call the function recursively
      savePagesRecursively();
    } else {
      console.log('Finished saving pages.');

      // Reset currentPageIndex when saving is complete
      currentPageIndex = 0;
    }
  }

  // Prompt user for the number of pages to save only once
  const numPagesToSave = parseInt(prompt('Enter the number of pages to save:'), 10);

  // Validate numPagesToSave to be a positive integer
  if (!isNaN(numPagesToSave) && numPagesToSave > 0) {
    numPages = numPagesToSave;
    stopSaving = false; // Reset the stopSaving flag
    savePagesRecursively(); // Start the recursive saving process
  } else {
    console.error('Invalid number of pages. Aborting operation.');
  }
}


// Listen for messages from the popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'saveAllPages') {
    const filenamePattern = prompt('Enter filename pattern (e.g., page_{pageNumber}.html):');
    saveAllPages(filenamePattern, 0); // Start from the first page
  } else if (request.action === 'stopSaving') {
    // Set the stopSaving flag to true
    stopSaving = true;
    console.log('Saving process stopped by user.');
    currentPageIndex = 0;
  }
});

// Function to save the HTML of the current page
function saveHTML(filenamePattern) {
  const currentPageNumber = currentPageIndex + 1;
  const htmlContent = document.documentElement.outerHTML;

  // Replace {pageNumber} in filename pattern with the actual page number
  const fileName = filenamePattern.replace('{pageNumber}', currentPageNumber);

  // Save the HTML content with the specified filename
  saveToFile(htmlContent, fileName);
}