// Initialize button with user's preferred color
let takeScreenshot = document.getElementById("changeColor");

// load libraries
window.onload = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab);
  
  // inject jcrop css
  chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ['dist/jcrop/jcrop.css'],
  });
  
  // inject jcrop js
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['dist/jcrop/jcrop.js'],
  });
};

// When the button is clicked, inject setPageBackgroundColor into current page
takeScreenshot.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // inject css
  await chrome.scripting.insertCSS({
    target: {tabId: tab.id},
    files: ['css/modal.css'],
  });

  // inject html
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: injectModal,
  });

  // inject modal js
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['js/modal.js'],
  });

  // load image
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: screenshot,
  });

  // inject jcrop modal js
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['js/jcrop-modal.js'],
  });


});

const injectModal = () => {
  // check for previous modals and remove if found
  const prevModal = document.querySelector('#myModal');
  prevModal != null ? prevModal.remove() : null;
  
  // draw modal
  document.body.innerHTML += `
    <div id="myModal" class="modal">
      <div id="modalContent" class="modal-content">
        <span class="modalClose">&times;</span>
        <p>Some text in the Modal..</p>
      </div>
    </div>
  `;
}

const screenshot = () => {
  // put image into modal
  chrome.runtime.sendMessage('screenshot', (response) => {
    let modalContent = document.querySelector('#modalContent');

    // append screenshot
    let img = document.createElement('img');
    // img.setAttribute('src', response.imgSrc);
    img.setAttribute('src', '../img/bg.jpg');
    img.setAttribute('id', 'ocr-target');
    modalContent.appendChild(img);
  }); 
}
