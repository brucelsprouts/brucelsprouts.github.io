const width = 160, height = 44;
const cubeWidth = 20;
const distanceFromCam = 100;
const incrementSpeed = 0.6;
const K1 = 40;
let A = 0.0, B = 0.0, C = 0.0;

const backgroundASCIICode = ' ';
const output = document.getElementById('output');
const buffer = new Array(width * height).fill(backgroundASCIICode);
const zBuffer = new Array(width * height).fill(0);

function calculateX(i, j, k) {
    return j * Math.sin(A) * Math.sin(B) * Math.cos(C) -
        k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
        j * Math.cos(A) * Math.sin(C) + k * Math.sin(A) * Math.sin(C) + i * Math.cos(B) * Math.cos(C);
}

function calculateY(i, j, k) {
    return j * Math.cos(A) * Math.cos(C) + k * Math.sin(A) * Math.cos(C) -
        j * Math.sin(A) * Math.sin(B) * Math.sin(C) + k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
        i * Math.cos(B) * Math.sin(C);
}

function calculateZ(i, j, k) {
    return k * Math.cos(A) * Math.cos(B) - j * Math.sin(A) * Math.cos(B) + i * Math.sin(B);
}

function calculateForSurface(cubeX, cubeY, cubeZ, ch) {
    const x = calculateX(cubeX, cubeY, cubeZ);
    const y = calculateY(cubeX, cubeY, cubeZ);
    const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;
    const ooz = 1 / z;

    const xp = Math.floor(width / 2 + K1 * ooz * x * 2);
    const yp = Math.floor(height / 2 + K1 * ooz * y);

    const idx = xp + yp * width;
    if (idx >= 0 && idx < width * height) {
        if (ooz > zBuffer[idx]) {
            zBuffer[idx] = ooz;
            buffer[idx] = ch;
        }
    }
}

function updateCube() {
    buffer.fill(backgroundASCIICode);
    zBuffer.fill(0);

    let cubeWidth = 20;
    let horizontalOffset = -2 * cubeWidth;

    // first cube
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    cubeWidth = 10;
    horizontalOffset = 1 * cubeWidth;

    // second cube
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    cubeWidth = 5;
    horizontalOffset = 8 * cubeWidth;

    // third cube
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
            calculateForSurface(cubeWidth, cubeY, cubeX, '$');
            calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
            calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
            calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
            calculateForSurface(cubeX, cubeWidth, cubeY, '+');
        }
    }

    // Render to the screen
    let outputText = '';
    for (let k = 0; k < width * height; k++) {
        outputText += buffer[k];
        if (k % width === width - 1) {
            outputText += '\n';
        }
    }
    output.textContent = outputText;

    // Update rotation angles and repeat the animation
    A += 0.01;  // Adjust these values for slower rotation
    B += 0.01;
    C += 0.005;
    
    requestAnimationFrame(updateCube);
}

// Start the animation
updateCube();
