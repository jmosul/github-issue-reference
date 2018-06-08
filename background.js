function extractIssueReferenceFromUrl(url) {
  url = url.replace('https://github.com/', '');
  url = url.replace('/issues', '');
  url = url.replace('/pull', '');

  const hashIndex = url.indexOf("#");

  url = hashIndex < 0 ? url : url.substr(0, hashIndex);

  const referenceParts = url.split('/');

  const reference = `${referenceParts[0]}/${referenceParts[1]}#${referenceParts[2]}`;

  const textArea = document.createElement("textarea");

  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = reference;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
  }
  catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

function onClickHandler(info, tab) {
  if(info.menuItemId === 'GHIssue_repopage'){
    extractIssueReferenceFromUrl(info.pageUrl);
  }
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create one test item for each context type.
  const contexts = ["page", "selection", "link", "editable", "image", "video", "audio"];
  const showForPages = ["*://github.com/*/*/issues/*", "*://github.com/*/*/pull/*"];

  for (let i = 0; i < contexts.length; i++) {
    const context = contexts[i];

    const id = chrome.contextMenus.create({
      "title": "Copy Issue Reference",
      "documentUrlPatterns":showForPages,
      "contexts": [context],
      "id": "GHIssue_repo" + context
    });
  }
});
