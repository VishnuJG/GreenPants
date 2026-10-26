// Background script for handling events and managing state

chrome.runtime.onInstalled.addListener(() => {
    console.log('Quick URL Editor installed.');
    // Initialize default settings or state if needed
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getSettings') {
        // Retrieve settings from storage
        chrome.storage.local.get(['settings'], (result) => {
            sendResponse(result.settings);
        });
        return true; // Indicates async response
    }
});
