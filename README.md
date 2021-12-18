# MADS Capstone - Twitter Content Filter Chrome Extension
A Twitter Content Filter Chrome Extension that can be downloaded and installed locally into a chrome browser. 
This extension works by initially hiding new Tweets loaded into a user's Timeline while scrolling down the page.
Next, it collects the text content of the Tweet and sends it to an API running on Google Cloud for machine learning 
sentiment analysis. If the predicted probability of the Tweet being positive is below a user-defined threshold 
(accessible in the extension user interface), then the Tweet will remain hidden on the Timeline. Otherwise, the 
previously hidden Tweet will be revealed.

Users also have the option to specify specific words or topics through
the extension user interface that they would like to have filtered from their Timeline. If these words are provided 
by the user, our algorithm will also consider synonyms and related topics and attempt to filter them as well. This
extension currently only supports filtering in the English language and all Tweets that are suspected to be
in a language other than English, will by default remain shown in the user's Timeline.

To learn more about the project, visit the Github repository [Social Media Content Filter](https://github.com/mphillipsjr96/SocialMedia_Content_Filter)

## Authors
- [Dylan Kinder](https://github.com/drkinder)
- [Michael Philips](https://github.com/mphillipsjr96)
- [Ryan Maloney](https://github.com/rmaloney820)

## Installation Instructions
1. Download this repository locally. 
2. Open your Google Chrome Browser and click on the puzzle icon at the top right corner of the browser, just below the 
minimize, resize, and exit buttons. 
3. Click on "Manage Extensions". 
4. Check the top right corner to make sure “Developer Mode” is toggled on. 
5. Now in the top left corner of the page, click “Load unpacked”. 
6. Find the extension directory on your computer downloaded from GitHub and select it. You should see a card with the 
label “Content Filter” appear in your list of installed Extensions. Note: if you see an error about a missing 
manifest.json file, make sure you select the directory containing the manifest.json file.
7. Pin this extension to your browser to make interacting with it easier by clicking the puzzle piece icon again, 
find "Twitter Content Filter" and click the pin icon. 
8. Go to Twitter or refresh Twitter if you were already on the page before loading the extension. The extension will 
begin working in the background with default settings. To add your own customer words to filter and tune the filter 
threshold to your preferred settings, click on the pinned extension with the letter "T".
