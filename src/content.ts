// This file is injected as a content script
const { DICT_KEY } = process.env;
const BASE_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json`;

document.addEventListener("dblclick", async (event) => {
  const selectedText = window.getSelection()?.toString();
  const anchoredNode = window.getSelection()?.anchorNode;

  document.querySelector(".term-definition")?.remove();

  if (selectedText?.trim() === "") return;

  const url = `${BASE_URL}/${encodeURI(
    selectedText?.trim() as string
  )}?key=${DICT_KEY}`;

  const results = await fetch(url);
  const data = await results.json();
  console.log(data);

  const scrollTop = window.pageYOffset
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;

  // Get cursor position;
  const posX = event.clientX;
  const postY = event.clientY + scrollTop;
  console.log(`Mouse Y: ${event.clientY} - ScrollTop: ${scrollTop}`);
  const html = `
    <div class="term-definition" style="height: 50px; width: 100px; background: #000; color: #FFF; position: absolute; top:${postY}; left:${posX}; ">
      <p>Here lies the term definition</p>
    </div>
    `;
  const parser = new DOMParser();
  const newNode = parser
    .parseFromString(html, "text/html")
    .querySelector(".term-definition");

  anchoredNode?.parentElement?.insertBefore(newNode as Node, null);
});
