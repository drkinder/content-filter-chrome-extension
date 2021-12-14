const url = 'https://content-filter-api-js23pan5iq-uc.a.run.app'


chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'validation') {
      chrome.storage.local.get(['threshold', 'filteredWords'], (retrieved_data) => {
        const threshold = retrieved_data.threshold || 0.5
        const filteredWords = retrieved_data.filteredWords || []
        const body = {body: request.text, threshold: threshold, filter_words: filteredWords}
        fetch(`${url}/filter-twitter-content/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then(response => response.json())
          .then(data => {
            sendResponse(data);
          })
          .catch(error => console.log("error", error));
      });
      return true
    } else if (request.type === 'threshold') {
      setThresholdInLocalStorage(request.threshold);
      return true
    } else if (request.type === 'filteredWords') {
      setFilteredlistWordsInLocalStorage(request.filteredWords);
      return true
    }
  }
);


const setThresholdInLocalStorage = (threshold) => {
  chrome.storage.local.get("threshold", (retrieved_data) => {
    if (retrieved_data.threshold !== threshold) {
      chrome.storage.local.set({
        threshold: threshold
      });
    }
  });
}


const setFilteredlistWordsInLocalStorage = (filteredWords) => {
  chrome.storage.local.set({filteredWords: filteredWords});
};
