document.getElementById('thresholdRange').onload = (event) => {
  const threshold = JSON.parse(localStorage.getItem('threshold'));
  if (threshold !== null) {
    document.getElementById('thresholdRange').value = threshold.threshold;
  } else {
    localStorage.setItem('threshold', JSON.stringify({threshold: event.target.value}));
  }
}


document.getElementById('thresholdRange').onchange = (event) => {
  localStorage.setItem('threshold', JSON.stringify({threshold: event.target.value}));
  chrome.runtime.sendMessage({type: "popup", threshold: event.target.value / 100});
}