document.getElementById("getUrl").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const iframe = document.querySelector("iframe[src*='youtube.com/embed/']");
      return iframe ? iframe.src : null;
    },
  });

  const ytEmbedUrl = results[0].result;
  const resultEl = document.getElementById("result");

  if (ytEmbedUrl) {
    // Extract the video ID from the embed URL
    const videoId = ytEmbedUrl.match(/embed\/([a-zA-Z0-9_-]+)/)?.[1];
    if (videoId) {
      // Make a mobile YouTube deep link
      const mobileLink = `vnd.youtube://${videoId}`;
      const webLink = `https://www.youtube.com/watch?v=${videoId}`;

      resultEl.textContent = `Opening video: ${webLink}`;

      // Try to open in YouTube app (Android deep link)
      window.location.href = mobileLink;

      // As a fallback, open in normal YouTube website if app not found
      setTimeout(() => {
        window.open(webLink, "_blank");
      }, 1000);
    } else {
      resultEl.textContent = "Couldn’t extract video ID.";
    }
  } else {
    resultEl.textContent = "No YouTube iframe found.";
  }
});
