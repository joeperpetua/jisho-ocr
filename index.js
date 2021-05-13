var croppr;
let takeScreenshot = document.querySelector('#make-selection');


// load libraries
window.onload = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);
    
    // inject css
    await chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        files: ['css/modal.css'],
    });

    await chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        files: ['css/cropper.css'],
    });

    await chrome.scripting.insertCSS({
        target: {tabId: tab.id},
        files: ['css/overlay.css'],
    });

    // inject html
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: injectModal,
    });

    // inject js
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/modal.js'],
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/cropper.js'],
    });

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['js/glfx.js'],
    });

};
  
// When the button is clicked, inject functions into current page
takeScreenshot.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('in');
    // load selector
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: loadScreenshot,
    });
  
});

const injectModal = () => {
    // check for previous modals and remove if found
    const prevModal = document.querySelector('#myModal');
    prevModal != null ? prevModal.remove() : null;
    
    // draw modal
    document.body.innerHTML += `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="modalClose">&times;</span>
                <img src="..." alt="selection preview" id="cropped-photo">
                <p id="crop-data"></p>
            </div>
        </div>
    `;
}

function loadScreenshot(){

    
    chrome.runtime.sendMessage('screenshot', async (response) => {
        // init html overlay
        let imgElement = document.createElement('img');
        imgElement.setAttribute('src', response.imgSrc);
        imgElement.setAttribute('id', 'croppr');  
        
    
        let quitElement = document.createElement('button');
        quitElement.setAttribute('class', 'quit-selection');
        // quitElement.setAttribute('style', `top: ${window.scrollY + 25}px`); 
        quitElement.textContent = 'X';
    
        let finishElement = document.createElement('button');
        finishElement.setAttribute('class', 'finish-selection');
        // finishElement.setAttribute('style', `top: ${window.scrollY + 25}px`); 
        finishElement.textContent = 'Finish crop';
    
        let body = document.querySelector('body');
        body.insertBefore(imgElement, body.firstChild);
        body.insertBefore(quitElement, body.firstChild);
        body.insertBefore(finishElement, body.firstChild);
    
        // init cropper
        croppr = await new Croppr('#croppr', {
            startSize: [0, 0, '%']
        });

        

        // init crop func
        const cropSelection = async (url, width, height, posX, posY) => {
            return new Promise(resolve => {
                // this image will hold our source image data
                const inputImage = new Image();
        
                // we want to wait for our image to load
                inputImage.onload = () => {
                    // create a canvas that will present the output image
                    const outputImage = document.createElement('canvas');
        
                    // set it to the same size as the image
                    outputImage.width = width;
                    outputImage.height = height;
        
                    // draw our image at given position on the canvas
                    const ctx = outputImage.getContext('2d');
                    ctx.drawImage(inputImage, posX * -1, posY * -1);
                    resolve(outputImage.toDataURL());
                };
        
                // start loading our image
                inputImage.src = url;
            });
            
        };

        const applyFilter = async(image, dataUrl) => {
            // try to create a WebGL canvas (will fail if WebGL isn't supported)
            try {
                var canvas = fx.canvas();
            } catch (e) {
                alert(e);
                return;
            }

            image.setAttribute('src', dataUrl);

            // convert the image to a texture
            var texture = canvas.texture(image);

            // apply the ink filter
            canvas.draw(texture).ink(0.25).update();

            return canvas.toDataURL('image/png');
        }
        

        // document.querySelector('.croppr').setAttribute('style', `top: ${window.scrollY}px`); 
        // let test = document.body.childNodes;
        // console.log(test[2]);

        document.querySelector('.finish-selection').addEventListener('click', async () => {
            let value = croppr.getValue();
            let dataUrl = await cropSelection(response.imgSrc, value.width, value.height, value.x, value.y);
            console.log(value)
            document.querySelector('.croppr-container').remove();
            document.querySelector('.quit-selection').remove();
            document.querySelector('.finish-selection').remove();
        
            
            // open modal
            let modal = document.querySelector("#myModal");
            modal.style.display = "block";
        
            let crop = document.querySelector("#cropped-photo");
            let filterDataUrl = await applyFilter(crop, dataUrl);
            crop.setAttribute('src', dataUrl);


            let coord = document.querySelector("#crop-data");
            coord.textContent = `x: ${value.x}, y: ${value.y}, width: ${value.width}, height: ${value.height}`;
        }); 
        
        
        document.querySelector('.quit-selection').addEventListener('click', () => {
            document.querySelector('.croppr-container').remove();
            document.querySelector('.quit-selection').remove();
            document.querySelector('.finish-selection').remove();
        }); 
    
    });

}



