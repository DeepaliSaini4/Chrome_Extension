const bookmarkSection = document.getElementById("bookmarks");

// Fetch bookmarks when the popup is loaded
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get([PROBLEM_KEY], (data) => {
    const currentBookmarks = data[PROBLEM_KEY] || [];
    viewBookmarks(currentBookmarks);
  });
});

function viewBookmarks(bookmarks) {
  bookmarkSection.innerHTML = "";

  if (bookmarks.length === 0) {
    bookmarkSection.innerHTML = "<i>No bookmarks to show</i>";
    return;
  }

  bookmarks.forEach((bookmark) => addNewBookmark(bookmark));
}

function addNewBookmark(bookmark) {
  const newBookmark = document.createElement("div");
  const bookmarkTitle = document.createElement("div");
  const bookmarkControls = document.createElement("div");

  bookmarkTitle.textContent = bookmark.name;
  bookmarkTitle.classList.add("bookmark-title");

  setControlAttributes(assetsURLMap["play"], onPlay, bookmarkControls);
  setControlAttributes(assetsURLMap["delete"], (event) => onDelete(event, bookmark.id), bookmarkControls);
  bookmarkControls.classList.add("bookmark-controls");

  newBookmark.classList.add("bookmark");
  newBookmark.append(bookmarkTitle, bookmarkControls);

  newBookmark.setAttribute("url", bookmark.url);
  newBookmark.setAttribute("bookmark-id", bookmark.id);

  bookmarkSection.appendChild(newBookmark);
}

function setControlAttributes(src, handler, parentDiv) {
  const controlElement = document.createElement("img");
  controlElement.src = src;
  controlElement.addEventListener("click", handler);
  parentDiv.appendChild(controlElement);
}

function onPlay(event) {
  const bookmarkItem = event.target.closest(".bookmark");
  const problemUrl = bookmarkItem.getAttribute("url");
  window.open(problemUrl, "_blank");
}

function onDelete(event, bookmarkId) {
  const bookmarkItem = event.target.closest(".bookmark");
  bookmarkItem.remove();

  // Update storage after deletion
  chrome.storage.sync.get([PROBLEM_KEY], (data) => {
    const currentBookmarks = data[PROBLEM_KEY] || [];
    const updatedBookmarks = currentBookmarks.filter(
      (bookmark) => bookmark.id !== bookmarkId
    );
    chrome.storage.sync.set({ [PROBLEM_KEY]: updatedBookmarks }, () => {
      console.log("Bookmark deleted from storage.");
    });
  });
}
