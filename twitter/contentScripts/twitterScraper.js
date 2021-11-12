let lastUrl = undefined;
const twitterObserverConfig = {childList: true, subtree: true};
const twitterTimelineConfig = {childList: true, subtree: true};
let timeline = null;
const processed_tweets = [];

const twitterObserver = new MutationObserver(() => {
  const url = location.href;
  if (lastUrl !== url) {
    if (url === 'https://twitter.com/home') {
      addObserverIfTimelineAvailable();
    } else {
      timelineObserver.disconnect()
      processed_tweets.length = 0;
    }
    lastUrl = url;
  }
})

twitterObserver.observe(document, twitterObserverConfig);


function addObserverIfTimelineAvailable() {
  timeline = document.querySelector('[aria-label="Timeline: Your Home Timeline"]');
  if (!timeline) {
    // The node we need does not exist yet. Wait 100ms and try again
    window.setTimeout(addObserverIfTimelineAvailable, 50);
    return;
  }
  // Observe the target node for configuration mutations
  timelineObserver.observe(timeline, twitterTimelineConfig);
}


const timelineObserver = new MutationObserver((mutations) => {
  [...mutations].forEach(mutation => {
    [...mutation.addedNodes].forEach(tweet => {
      const tweetArticles = [...tweet.getElementsByTagName("article")]
      if (Array.isArray(tweetArticles) && tweetArticles.length === 1) {
        validateTweet(tweet, tweetArticles[0]);
      }
    });
  });
});


const validateTweet = (tweet, tweetArticle) => {
  const tweetObject = constructTweetArticleObject(tweetArticle);
  const display_style = tweet.style.display;

  const matched_tweets = processed_tweets.filter(el => el.text === tweetObject.text)
  if (Array.isArray(matched_tweets) && matched_tweets.length === 0) {
    tweet.style.display = 'none';
    chrome.runtime.sendMessage({type: "validation", ...tweetObject}, (response) => {
      tweetObject['valid'] = response.valid;
      processed_tweets.push(tweetObject);
      if (response.valid) {
        tweet.style.display = display_style;
      }
    })
  } else {
    if (!matched_tweets[0].valid) {
      tweet.style.display = 'none';
    }
  }
}


const constructTweetArticleObject = (tweet) => {
  return {
    "id": tweet.attributes.getNamedItem('aria-labelledby').value,
    "text": tweet.querySelector('[lang]').textContent
  }
}
