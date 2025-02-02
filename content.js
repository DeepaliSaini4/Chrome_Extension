 const bookmarkImgURL = chrome.runtime.getURL("Assets/bookmark.png");
window.addEventListener("load", addBookmarkButton);

function addBookmarkButton(){
    const BookmarkButton = document.createElement('img');
    BookmarkButton.id = "add-bookmark-button";
    BookmarkButton.src= bookmarkImgURL;
    BookmarkButton.style.height = "30px";
    BookmarkButton.style.width = "30px";

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    askDoubtButton.insertAdjacentElement("beforebegin", BookmarkButton);
}