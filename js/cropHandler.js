

const openSelection = () => {

    let quitElement = document.createElement('button');
    quitElement.setAttribute('class', 'quit-selection');
    // quitElement.setAttribute('onclick', 'quitSelection()');
    quitElement.textContent = 'X';

    let finishElement = document.createElement('button');
    finishElement.setAttribute('class', 'finish-selection');
    // finishElement.setAttribute('onclick', 'getPosition()');
    finishElement.textContent = 'Finish crop';

    let body = document.querySelector('body');
    body.insertBefore(quitElement, body.firstChild);
    body.insertBefore(finishElement, body.firstChild);

    croppr = new Croppr('#croppr', {
        startSize: [0, 0, '%']
    });

};

const getPosition = async () => {
    let value = croppr.getValue();
    let dataUrl = await cropSelection('screenshot.jfif', value.width, value.height, value.x, value.y);
    console.log(value)
    quitSelection();

    
    // open modal
    let modal = document.querySelector("#myModal");
    modal.style.display = "block";

    let crop = document.querySelector("#cropped-photo");
    crop.setAttribute('src', dataUrl);

    let coord = document.querySelector("#crop-data");
    coord.textContent = `x: ${value.x}, y: ${value.y}, width: ${value.width}, height: ${value.height}`;
};

const cropSelection = (url, width, height, posX, posY) => {
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

const quitSelection = () => {
    // document.querySelector('.croppr-container').remove();
    document.querySelector('.quit-selection').remove();
    document.querySelector('.finish-selection').remove();
};

openSelection();

