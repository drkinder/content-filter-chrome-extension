document.body.onload = () => {
  retrieveThresholdRange()
  retrieveFilteredWordsFromLocalStorage()
}

const retrieveThresholdRange = () => {
  const threshold = JSON.parse(localStorage.getItem('threshold'));
  if (threshold == null) return

  document.getElementById('thresholdRange').value = 100 - threshold.threshold;
  chrome.runtime.sendMessage({type: "threshold", threshold: (100 - threshold.threshold) / 100})
}

const retrieveFilteredWordsFromLocalStorage = () => {
  let filteredWordsLocalStorage = JSON.parse(localStorage.getItem("filteredWords"));
  if (filteredWordsLocalStorage == null) return

  filteredWordsLocalStorage.forEach(filteredWord => {
    appendWordToFilteredList(filteredWord);
  })
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: filteredWordsLocalStorage})
}


document.getElementById('thresholdRange').onchange = (event) => {
  localStorage.setItem('threshold', JSON.stringify({threshold: (100 - event.target.value)}));
  chrome.runtime.sendMessage({type: "threshold", threshold: (100 - event.target.value) / 100})
}


document.getElementById("filteredWordForm").addEventListener('submit', (event) => {
  event.preventDefault();
  const word = event.target.elements.filteredWordInput.value;
  appendWordToFilteredList(word);
  addFilteredWordToLocalStorage(word);
  document.getElementById("filteredWordInput").value = '';
});


const addFilteredWordToLocalStorage = (word) => {
  let filteredWordsLocalStorage = JSON.parse(localStorage.getItem("filteredWords"));
  if (filteredWordsLocalStorage == null) filteredWordsLocalStorage = [];
  filteredWordsLocalStorage.push(word);
  localStorage.setItem("filteredWords", JSON.stringify(filteredWordsLocalStorage));
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: filteredWordsLocalStorage})
};


const appendWordToFilteredList = (word) => {
  if (word) {
    const filteredWordsList = document.getElementById("filteredWordsList");
    const div = document.createElement("div");
    const btn = document.createElement("button");
    btn.appendChild(document.createTextNode("x"));
    btn.classList.add("background-blue", "no-border", "text-white")
    div.classList.add("w-5", "d-inline")
    btn.onclick = function () {
      document.getElementById(`${word}-div`).outerHTML = "";
      deleteFilteredWordToLocalStorage(word)
    }
    div.id = `${word}-div`;
    div.appendChild(btn);
    div.appendChild(document.createTextNode(word));
    filteredWordsList.appendChild(div);
  }
}

const deleteFilteredWordToLocalStorage = (word) => {
  let filteredWordsLocalStorage = JSON.parse(localStorage.getItem("filteredWords"));
  filteredWordsLocalStorage = filteredWordsLocalStorage.filter(filteredWord => filteredWord !== word)
  localStorage.setItem("filteredWords", JSON.stringify(filteredWordsLocalStorage));
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: filteredWordsLocalStorage})
};


document.getElementById('btn-reset').onclick = () => {
  resetFilteredWordsList()
  resetThresholdRange()
}


const resetFilteredWordsList = () => {
  const filteredWordsList = document.getElementById("filteredWordsList")
  while (filteredWordsList.firstChild) {
    filteredWordsList.firstChild.remove()
  }
  localStorage.removeItem("filteredWords")
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: []})
}


const resetThresholdRange = () => {
  localStorage.removeItem('threshold')
  chrome.runtime.sendMessage({type: "threshold", threshold: 0.5})
  document.getElementById('thresholdRange').value = 50;
}