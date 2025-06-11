// options.js
const input = document.getElementById('segment-input');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const segmentList = document.getElementById('segment-list');

let segments = [];

chrome.storage.sync.get("segments", (data) => {
  segments = data.segments || [
    "10% OFF", "Free Shipping", "20% OFF", "Try Again", "5% OFF", "No Luck"
  ];
  renderList();
});

function renderList() {
  segmentList.innerHTML = '';
  segments.forEach((seg, idx) => {
    const li = document.createElement('li');
    li.className = 'segment-item';

    const text = document.createElement('input');
    text.type = 'text';
    text.value = seg;
    text.oninput = (e) => segments[idx] = e.target.value;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remove';
    delBtn.onclick = () => {
      segments.splice(idx, 1);
      renderList();
    };

    li.appendChild(text);
    li.appendChild(delBtn);
    segmentList.appendChild(li);
  });
}

addBtn.onclick = () => {
  if (input.value.trim()) {
    segments.push(input.value.trim());
    input.value = '';
    renderList();
  }
};

saveBtn.onclick = () => {
  chrome.storage.sync.set({ segments }, () => {
    console.log("Segments saved as: ", segments);
    alert("Segments saved!");
  });
};
