let phishingList = [];

async function fetchLinks() {
  try {
    const res = await fetch(
      'https://firestore.googleapis.com/v1/projects/phisquard/databases/(default)/documents/phishing_links'
    );
    const data = await res.json();
    phishingList = data.documents.map((doc) => doc.fields.url.stringValue);
  } catch (error) {
    console.error('Error fetching phishing list:', error);
  }
}

chrome.runtime.onInstalled.addListener(() => {
  fetchLinks();
  setInterval(fetchLinks, 5 * 60 * 1000); // Refresh every 5 mins
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    if (phishingList.includes(url.hostname)) {
      return { cancel: true };
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
