const input = document.getElementById('segment-input');
const addBtn = document.getElementById('add-btn');
const saveBtn = document.getElementById('save-btn');
const segmentList = document.getElementById('segment-list');

let segments = [];

chrome.storage.sync.get("segments", (data) => {
    let rawSegments = data.segments;
  
    // Handle case: no saved data (use default)
    if (!Array.isArray(rawSegments)) {
      rawSegments = getDefaultSegments();
    }
  
    // Handle legacy string-based segments
    const segmentsValid = rawSegments.every(seg => typeof seg === 'object' && 'text' in seg);
    if (!segmentsValid) {
      // Migrate legacy string segments to object format
      segments = rawSegments.map((seg, idx) => ({
        text: typeof seg === 'string' ? seg : `Segment ${idx + 1}`,
        color: defaultColor(idx),
      }));
      // Save migrated version
      chrome.storage.sync.set({ segments });
    } else {
      segments = rawSegments;
    }
  
    renderList();
  });
  
  // Helpers
  function getDefaultSegments() {
    return [
      { text: "10% OFF", color: "#FF6B6B" },
      { text: "Free Shipping", color: "#FFD93D" },
      { text: "20% OFF", color: "#6BCB77" },
      { text: "Try Again", color: "#4D96FF" },
      { text: "5% OFF", color: "#B983FF" },
      { text: "No Luck", color: "#FF9F1C" }
    ];
  }
  
  function defaultColor(i) {
    const palette = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#B983FF", "#FF9F1C"];
    return palette[i % palette.length];
  }
  

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
