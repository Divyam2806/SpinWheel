fetch(chrome.runtime.getURL('index.html'))
  .then(res => res.text())
  .then(html => {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script.js');
    document.body.appendChild(script);
  });
