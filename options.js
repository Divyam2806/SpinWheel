const input = document.getElementById('segment-input');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const segmentList = document.getElementById('segment-list');

let segments = [];

chrome.storage.sync.get("segments", (data) => {
  console.log("data received is: ", data);
  segments = data.segments || [
    { text: "10% OFF", color: "#FF6B6B" },
    { text: "Free Shipping", color: "#FFD93D" },
    { text: "20% OFF", color: "#6BCB77" },
    { text: "Try Again", color: "#4D96FF" },
    { text: "5% OFF", color: "#B983FF" },
    { text: "No Luck", color: "#FF9F1C" }
  ];
  renderList();
});

function renderList() {
  segmentList.innerHTML = '';
  console.log("Rendering list with segments: ", segments);

  segments.forEach((seg, idx) => {
    const li = document.createElement('li');
    li.className = 'segment-item';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = seg.text;
    textInput.placeholder = 'Segment Text';
    textInput.oninput = (e) => segments[idx].text = e.target.value;

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = seg.color || '#FFFFFF';
    colorInput.oninput = (e) => segments[idx].color = e.target.value;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Remove';
    delBtn.onclick = () => {
      segments.splice(idx, 1);
      renderList();
    };

    li.appendChild(textInput);
    li.appendChild(colorInput);
    li.appendChild(delBtn);
    segmentList.appendChild(li);
  });
}

addBtn.onclick = () => {
  if (input.value.trim()) {
    segments.push({ text: input.value.trim(), color: '#FF6B6B' });
    input.value = '';
    renderList();
  }
};

saveBtn.onclick = () => {
  chrome.storage.sync.set({ segments }, () => {
    console.log("Set segments as: ", segments);
    alert("Segments saved!");
  });
};
