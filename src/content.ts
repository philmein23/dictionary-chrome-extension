// This file is injected as a content script
console.log("Hello from content script!");
const KEY = process.env.DICT_KEY;
const BASE_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json`;

document.addEventListener("dblclick", async (event) => {
    const selectedText = window.getSelection()?.toString();

    if (selectedText?.trim() === "") return;

    let url = `${BASE_URL}/${encodeURI(selectedText?.trim() as string)}?key=${KEY}`;

    const results = await fetch(url);
    const data = await results.json();
    console.log(data);
})