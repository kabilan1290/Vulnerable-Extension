document.addEventListener("DOMContentLoaded", async () => {
  const output = document.getElementById("output");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const [{ result: selectedText }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString()
    });

    if (!selectedText) {
      output.textContent = "Please select some text before clicking the extension.";
      return;
    }

    if (!window.Summarizer) {
      output.textContent = "Summarizer API not supported in this browser.";
      return;
    }

    const summarizer = await Summarizer.create({
      sharedContext: "A general summary and a step by step guide",
      type: "tldr",
      length: "short",
      format: "markdown",
      expectedInputLanguages: ["en-US"],
      outputLanguage: "en-US"
    });

    const summary = await summarizer.summarize(selectedText);
    output.textContent = summary;
    console.log("Summary:", summary);
  } catch (err) {
    output.textContent = "Error summarizing text: " + err.message;
    console.error(err);
  }
});
