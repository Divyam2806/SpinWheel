chrome.runtime.sendMessage({ type: "getSegments" }, (response) => {
  

  const segments = response && Array.isArray(response) ? response :[
  { text: "10% OFF", color: "#FF6B6B" },
  { text: "Free Shipping", color: "#FFD93D" },
  { text: "20% OFF", color: "#6BCB77" },
  { text: "Try Again", color: "#4D96FF" },
  { text: "5% OFF", color: "#B983FF" },
  { text: "No Luck", color: "#FF9F1C" }
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
