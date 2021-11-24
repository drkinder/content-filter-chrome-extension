document.body.onload = (event) => {
  setThresholdRange(event)
  retrieveFilteredWordsFromLocalStorage()

}

const setThresholdRange = (event) => {
  const threshold = JSON.parse(localStorage.getItem('threshold'));
  if (threshold !== null) {
    document.getElementById('thresholdRange').value = threshold.threshold;
  } else {
    localStorage.setItem('threshold', JSON.stringify({threshold: event.target.value}));
  }
}

const retrieveFilteredWordsFromLocalStorage = () => {
  let filteredWordsLocalStorage = JSON.parse(localStorage.getItem("filteredWords"));
  if (filteredWordsLocalStorage == null) filteredWordsLocalStorage = [];
  filteredWordsLocalStorage.forEach(filteredWord => {
    appendWordToFilteredList(filteredWord);
  })
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: filteredWordsLocalStorage})
}


document.getElementById('thresholdRange').onchange = (event) => {
  localStorage.setItem('threshold', JSON.stringify({threshold: event.target.value}));
  chrome.runtime.sendMessage({type: "threshold", threshold: event.target.value / 100})
}


document.getElementById("filteredWordForm").addEventListener('submit', (event) => {
  event.preventDefault();
  const word = event.target.elements.filteredWordInput.value;
  appendWordToFilteredList(word);
  addFilteredWordToLocalStorage(word);
  document.getElementById("FilteredWordInput").value = '';
});


const addFilteredWordToLocalStorage = (word) => {
  let filteredWordsLocalStorage = JSON.parse(localStorage.getItem("filteredWords"));
  if (filteredWordsLocalStorage == null) filteredWordsLocalStorage = [];
  filteredWordsLocalStorage.push(word);
  localStorage.setItem("filteredWords", JSON.stringify(filteredWordsLocalStorage));
  chrome.runtime.sendMessage({type: "filteredWords", filteredWords: filteredWordsLocalStorage})
};


const appendWordToFilteredList = (word) => {
  const filteredWordsList = document.getElementById("filteredWordsList");
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(word));
  filteredWordsList.appendChild(li);
}