const iframes = document.querySelectorAll("iframe[src*='youtube.com/embed/']");
iframes.forEach(iframe => console.log("Found YouTube video:", iframe.src));
