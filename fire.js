const firePixelsArray = [];
const fireWidth = 40;
const fireHeight = 40;
let windDirection = 'none';
const debug = false;
const canvas = document.querySelector('#fireCanvas');

const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}];



function start() {
    createFireDataStructure();
    createFireSource();
    renderFire();
    
    setInterval(calculateFirePropagation, 50);
}

function createFireDataStructure() {
    const numberOfPixels = fireWidth * fireHeight;
    
    for (let i = 0; i < numberOfPixels; i++){
        firePixelsArray[i] = 0;
    }
}

function calculateFirePropagation() {
    for (let column = 0; column < fireWidth; column++) {
        for(let row = 0; row < fireHeight; row++) {
            const pixelIndex = column + (fireWidth * row);
            
            updateFireIntensityPerPixel(pixelIndex);
        }
    }
    //Render the canvas after calculating all intensity values
    renderFire();
}

function updateFireIntensityPerPixel(currentPixelIndex) {
    const belowPixelIndex = currentPixelIndex + fireWidth;
    
    //Check if the pixel index is bigger than the canvas to do nothing
    if(belowPixelIndex >= fireWidth * fireHeight){
        return;
    }
    
    //Fire decrement intesity unit
    const decay = Math.floor(Math.random() * 3);
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    //Avoid negative values
    const newFireIntensity = 
          belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0;
    
    switch(windDirection){
      case 'none': firePixelsArray[currentPixelIndex] = newFireIntensity; break;
      case 'left': firePixelsArray[currentPixelIndex - decay] = newFireIntensity; break;
      case 'right': firePixelsArray[currentPixelIndex + decay] = newFireIntensity; break;
   }
}

function renderFire() {
    
    let html = '<table cellpadding=0 cellspacing=0>';
    
    for(let row = 0; row < fireHeight; row++){
        html += '<tr>';
        for(let column = 0; column < fireWidth; column++){
            const pixelIndex = column + ( fireWidth * row);
            const fireIntensity = firePixelsArray[pixelIndex];
            
            if(debug === true) {
                html += '<td>';
                html += `<div class="pixel-index">${pixelIndex}</div>`;
                html += fireIntensity;
                html += '</td>'; 
            } else {
                const color = fireColorsPalette[fireIntensity];
                const colorString = `${color.r}, ${color.g}, ${color.b}`;
                html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
                html += `</td>`;
            }
            
            
        }
        html += '</tr>';
    }
    
    html += '</table>';
    
    
    canvas.innerHTML = html;
}

function createFireSource() {
    for (let column = 0; column <= fireWidth; column++) {
        const overFlowPixelIndex = fireWidth * fireHeight;
        const pixelIndex = (overFlowPixelIndex - fireWidth) + column;
        
        firePixelsArray[pixelIndex] = 36;
    }
}

function windMove(e){
    const marginLeft = canvas.getBoundingClientRect().left;
    const marginTop = canvas.getBoundingClientRect().top;
    
    const { offsetHeight: height, offsetWidth: width } = canvas;
    let { offsetX: x, offsetY: y } = e;
    
    if (this !== e.target) {
        x = x + e.target.offsetLeft;
        y = y + e.target.offsetTop;
    }
    
    let limitLeft = marginLeft + width;
    let limitTop = marginTop + height;
    let half = marginLeft + (width / 2);



    if(x > half && x <= limitLeft && y > marginTop && y <= limitTop) {
        windDirection = 'left';
    } else if (x <= half && x > marginLeft && y > marginTop && y <= limitTop) {
        windDirection = 'right';
    } else windDirection = 'none';
}

start();
document.querySelector('.container').addEventListener("mousemove", windMove);