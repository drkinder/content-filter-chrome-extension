const url = 'https://content-filter-api-js23pan5iq-uc.a.run.app/'


chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'validation') {
      chrome.storage.local.get('threshold', (retrieved_data) => {
        const threshold = (typeof retrieved_data.threshold === 'undefined' ? 0.5 : retrieved_data.threshold);
		console.log(threshold);
        fetch(url + 'filter-multinomial-naive-bayes/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({body: request.text, threshold: threshold}),
        }).then(response => response.json())
          .then(data => {
          console.log(data);
            sendResponse({valid: data.filter, confidencePositive: data.confidencepostive})
          })
          .catch(error => console.log("error", error))
      });
      return true
    } else if (request.type === 'popup') {
      chrome.storage.local.get('threshold', (retrieved_data) => {
        if (retrieved_data.threshold !== request.threshold) {
          chrome.storage.local.set({threshold: request.threshold});
        }
      });
      return true
    }
  }
);
