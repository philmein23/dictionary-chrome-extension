// This file is injected as a content script
import "./content.css";

const { DICT_KEY } = process.env;
const BASE_URL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json`;

async function getTermDefinitionData(term: string) {
  const url = `${BASE_URL}/${encodeURI(
    term?.trim() as string
  )}?key=${DICT_KEY}`;

  const results = await fetch(url);
  const data = await results.json();
  console.log(data);
  return data[0];
}

async function createDefinitionPopup(event: MouseEvent) {
  const selectedText = window.getSelection()?.toString();

  document.querySelector(".term-definition-container")?.remove();

  if (selectedText?.trim() === "") return;

  const termData = await getTermDefinitionData(selectedText as string);

  const scrollTop = window.pageYOffset
    ? window.pageYOffset
    : (document.documentElement || document.body.parentNode || document.body)
        .scrollTop;

  // Get cursor position;
  const posX = event.clientX - 140;
  const postY = event.clientY + scrollTop - 140;
  console.log(
    `Mouse X: ${event.clientX} Mouse Y: ${event.clientY} - ScrollTop: ${scrollTop}`
  );

  const listString = termData.shortdef.reduce((accum: string, curr: string) => {
    accum += `<li>${curr}</li>`;
    return accum;
  }, "");

  const htmlString = `
    <div class="term-definition-container" style="position: absolute; top: ${postY}px; left: ${posX}px; ">
      <div class="term-definition">
        ${listString}
      </div>  
    </div>
    `;

  // parses html string into dom element (node) then inserts it relative to body element
  document.body.insertAdjacentHTML("afterbegin", htmlString);
}

/** remove event listener to prevent memory leaks */
console.log("removing event listener...");
document.removeEventListener("dblclick", createDefinitionPopup);
/** then re-add event listener */
console.log("adding event listener...");
document.addEventListener("dblclick", createDefinitionPopup);
