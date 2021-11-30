const twitterTittleObserverConfig = {childList: true, subtree: true};
const twitterTimelineConfig = {childList: true, subtree: true};
const processed_tweets = [];

const pageToSelectorMap = [
  {location: 'home', timelineSelector: '[aria-label="Timeline: Your Home Timeline"]'},
  {location: 'explore', timelineSelector: '[aria-label="Timeline: Explore"]'},
]

function addTitleObserverIfAvailable() {
  const title = document.getElementsByTagName('title')
  if (!title || !title[0]) {
    //The node we need does not exist yet.
    //Wait 100ms and try again
    window.setTimeout(addTitleObserverIfAvailable, 50);
    return;
  }
  console.log(title[0].innerText)
  twitterTitleObserver.observe(title[0], twitterTittleObserverConfig)

}

addTitleObserverIfAvailable();

const twitterTitleObserver = new MutationObserver(() => {
  const title = document.getElementsByTagName('title');

  const titleText = title[0].innerText.toLowerCase();
  const twitterLocationText = location.href.split('/').at(-1).toLowerCase();

  const twitterLocation = pageToSelectorMap.find(location => location.location === twitterLocationText);

  if (twitterLocation) {
    addObserverIfTimelineAvailable(twitterLocation.timelineSelector);
  } else if (titleText.includes(`@${twitterLocationText}`)) {
    const newTwitterLocation = {
      location: twitterLocationText,
      timelineSelector: '[aria-label^="Timeline:"][aria-label*="Tweets"]'
    };
    pageToSelectorMap.push(newTwitterLocation);
    addObserverIfTimelineAvailable(newTwitterLocation.timelineSelector);
  } else {
    timelineObserver.disconnect();
    processed_tweets.length = 0;
  }
})


function addObserverIfTimelineAvailable(timelineSelector) {
  const timeline = document.querySelector(timelineSelector);

  console.log(timeline)
  if (!timeline) {
    //The node we need does not exist yet.
    //Wait 100ms and try again
    window.setTimeout(addObserverIfTimelineAvailable, 50, timelineSelector);
    return;
  }
  console.log(timeline)
  // Start observing the target node for configured mutations
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

  const matched_tweets = processed_tweets.filter(el => el.text === tweetObject.text);
  if (Array.isArray(matched_tweets) && matched_tweets.length === 0) {
    tweet.style.display = 'none';
    chrome.runtime.sendMessage({type: "validation", ...tweetObject}, (response) => {
      tweetObject['valid'] = response.valid;
      tweetObject['confidencePositive'] = response.confidencePositive;
      processed_tweets.push(tweetObject);
      if (response.valid) {
		console.log('Tweet Approved!');
        tweet.style.display = display_style;
      } 
    })
  } else {
    if (!matched_tweets[0].valid) {
	  console.log('Tweet Blocked!');
      // console.log(`Confidence Positive: ${matched_tweets[0].confidencePositive}`);
      console.log(matched_tweets[0].text);
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
