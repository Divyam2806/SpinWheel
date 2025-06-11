chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getSegments") {
      chrome.storage.sync.get(["segments"], (result) => {
        console.log("Sending response as: ", result.segments);
        sendResponse( result.segments || [] );
      });
  
      // ❗Important: tell Chrome that the response is async
      return true;
    }
  });
  