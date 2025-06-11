chrome.runtime.sendMessage({ type: "getSegments" }, (response) => {
  console.log("the response is: ",response);
  
  const segments = response && Array.isArray(response) ? response : [
    "10% OFF", "Free Shipping", "20% OFF", "Try Again", "5% OFF", "No Luck"
  ];

  console.log("segments is: ", segments);

  // Inject HTML
  fetch(chrome.runtime.getURL('index.html'))
    .then(res => res.text())
    .then(html => {
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);

      // Inject script.js
      const script = document.createElement('script');
      script.src = chrome.runtime.getURL('script.js');
      script.onload = () => {
        // Now safely pass the segments
        console.log("passing segments to script.js");
        window.postMessage({ type: "WHEEL_SEGMENTS", segments }, "*");
      };
      document.body.appendChild(script);
    });
});
