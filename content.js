const bookmarkImgURL = chrome.runtime.getURL("Assets/bookmark.png");
const PROBLEM_KEY = "PROBLEM_KEY"; 
 window.addEventListener("load", addBookmarkButton);

 const observer = new MutationObserver(() =>{
    addBookmarkButton();
 }) 

 observer.observe(document.body, {childList: true, subtree: true});

 addBookmarkButton();

 function onProblemPage(){
    return window.location.pathname.startsWith('/problems/');
 }

function addBookmarkButton(){
    console.log("Trigerring"); 
    if(!onProblemPage() || !document.getElementById("add-bookmark-button")) return ;
    if(!onProblemPage())return;
    const BookmarkButton = document.createElement('img');
    BookmarkButton.id = "add-bookmark-button";
    BookmarkButton.src= bookmarkImgURL;
    BookmarkButton.style.height = "30px";
    BookmarkButton.style.width = "30px";

    const askDoubtButton = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    askDoubtButton.parentNode.insertAdjacentElement("afterend", BookmarkButton);
    BookmarkButton.addEventListener("click", addNewBookmarkHandler);
}

async function addNewBookmarkHandler(){
    const currentBookmarks = await getCurrentBookmarks();  
    const problemurl = window.location.href;
    const uniqueId = extractUniqueId(problemurl); 
    const problemName = document.querySelector("h4.problem_heading").textContent;

    if(currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

    const bookmarkObj = {
        id: uniqueId,
        name: problemName,
        url: problemurl
    }

    const updatedbookmarks = [...currentBookmarks, bookmarkObj];

    chrome.storage.sync.set({PROBLEM_KEY: updatedbookmarks}, () =>{
        console.log("updated the bookmarks correctly to", updatedbookmarks);
    })
}

function extractUniqueId(url){
        const start = url.indexOf("problems/") + "problems/".length;
        const end = url.indexOf("?", start);
        return url.substring(start, end);   
}

function getCurrentBookmarks(){
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([PROBLEM_KEY ], (results) => {
            resolve(results[PROBLEM_KEY] || []);
        });

    })
}