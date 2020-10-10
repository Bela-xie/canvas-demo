//初始化
let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
let painting = false;
let isTouchDevice = "ontouchstart" in document.documentElement;
let last;
let currentColor = "black"
let currentLineWidth = 6;
//设置颜色
setColor();
//监听按钮点击事件
listenButtonClick();
//初始化画板
let ctx = canvas.getContext("2d");


const drawOnDevicesMap = {
    drawLineOnDevices: isTouchDevice ? drawLineOnTouchDevice : drawLineOnClickDevice,
    drawRectOnDevices: isTouchDevice ? drawRectOnTouchDevice : drawRectOnClickDevice,
    drawArcOnDevices: isTouchDevice ? drawArcOnTouchDevice : drawArcOnClickDevice,
    drawTriangleOnDevices: isTouchDevice ? drawTriangleOnTouchDevice : drawTriangleOnClickDevice,
    // drawTriangle90OnDevices: isTouchDevice ? drawTriangle90OnTouchDevice : drawTriangle90OnClickDevice,
}
drawOnDevicesMap["drawLineOnDevices"]()
//添加active类
function addActive(btn) {
    const btns = document.querySelectorAll("button")
    for (let i = 0; i < btns.length; i++) {
        if (btns[i].classList.contains("active")) {
            btns[i].classList.remove("active")
        }
    }
    btn.classList.add("active")
}

//监听按钮点击事件
function listenButtonClick() {
    const smallBtn = document.getElementById("small")
    const mediumBtn = document.getElementById("medium")
    const bigBtn = document.getElementById("big")
    const rectBtn = document.getElementById("rect")
    const arcBtn = document.getElementById("arc")
    const triangleBtn = document.getElementById("triangle")
    const triangle90Btn = document.getElementById("triangle-90")
    smallBtn.onclick = e => {
        currentLineWidth = e.currentTarget.dataset.size;
        addActive(e.currentTarget)
        drawOnDevicesMap["drawLineOnDevices"]();
    }
    mediumBtn.onclick = e => {
        currentLineWidth = e.currentTarget.dataset.size;
        addActive(e.currentTarget)
        drawOnDevicesMap["drawLineOnDevices"]();
    }
    bigBtn.onclick = e => {
        currentLineWidth = e.currentTarget.dataset.size;
        addActive(e.currentTarget)
        drawOnDevicesMap["drawLineOnDevices"]();
    }
    rectBtn.onclick = e => {
        addActive(e.currentTarget)
        drawOnDevicesMap["drawRectOnDevices"]();
    }
    arcBtn.onclick = e => {
        addActive(e.currentTarget)
        drawOnDevicesMap["drawArcOnDevices"]();
    }
    triangleBtn.onclick = e => {
        addActive(e.currentTarget)
        drawOnDevicesMap["drawTriangleOnDevices"](false);
    }
    triangle90Btn.onclick = e => {
        addActive(e.currentTarget)
        drawOnDevicesMap["drawTriangleOnDevices"](true);
    }
}

//设置颜色
function setColor() {
    const colorInput = document.getElementById("color")
    currentColor = colorInput.value;
    colorInput.oninput = e => {
        currentColor = e.target.value;
    }
}

//绘制线
function drawLine(x1, x2, y1, y2) {
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, x2);
    ctx.lineTo(y1, y2);
    ctx.stroke();
    ctx.closePath();
}

//在触摸屏上绘制线
function drawLineOnTouchDevice() {
    canvas.ontouchstart = (e) => {
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
    canvas.ontouchmove = (e) => {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        drawLine(last[0], last[1], x, y);
        last = [x, y];
    }
}

//在非触摸屏上绘制线
function drawLineOnClickDevice() {
    canvas.onmousemove = (e) => {
        if (painting === true) {
            drawLine(last[0], last[1], e.clientX, e.clientY);
            last = [e.clientX, e.clientY];
        }
    }
    canvas.onmousedown = (e) => {
        last = [e.clientX, e.clientY];
        painting = true;
    }
    canvas.onmouseup = () => {
        painting = false;
    }
}

//在触摸屏上绘制矩形
function drawRectOnTouchDevice() {
    let lastWidth;
    let lastHeight;
    ctx.lineWidth = 2;
    canvas.ontouchstart = (e) => {
        ctx.strokeStyle = currentColor;
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
    canvas.ontouchmove = (e) => {
        let x = e.touches[0].clientX;
        let y = e.touches[0].clientY;
        ctx.clearRect(last[0], last[1], lastWidth, lastHeight);
        ctx.strokeRect(last[0], last[1], x - last[0], y - last[1]);
        lastWidth = x - last[0];
        lastHeight = y - last[1]
    }
    canvas.ontouchend = e => {
        if (e.touches.length > 0) {
            ctx.strokeRect(last[0], last[1], e.touches[0].clientX - last[0], e.touches[0].clientY - last[1]);
        }
    }
}

//在非触摸屏上绘制矩形
function drawRectOnClickDevice() {
    let lastWidth;
    let lastHeight;
    ctx.lineWidth = 2;
    canvas.onmousemove = (e) => {
        if (painting === true) {
            ctx.clearRect(last[0], last[1], lastWidth, lastHeight);
            ctx.strokeRect(last[0], last[1], e.clientX - last[0], e.clientY - last[1]);
            lastWidth = e.clientX - last[0];
            lastHeight = e.clientY - last[1]
        }
    }
    canvas.onmousedown = (e) => {
        ctx.strokeStyle = currentColor;
        last = [e.clientX, e.clientY];
        painting = true;
    }
    canvas.onmouseup = e => {
        ctx.strokeRect(last[0], last[1], e.clientX - last[0], e.clientY - last[1]);
        painting = false;
    }
}

//绘制圆形
function drawArc(e) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = currentColor;
    ctx.beginPath();
    let x;
    let y;
    let radius;
    if (isTouchDevice) {
        x = last[0] + (e.touches[0].clientX - last[0]) / 2;
        y = last[1] + (e.touches[0].clientY - last[1]) / 2;
        radius = (e.touches[0].clientX - last[0]) / 2;
    } else {
        x = last[0] + (e.clientX - last[0]) / 2;
        y = last[1] + (e.clientY - last[1]) / 2;
        radius = (e.clientX - last[0]) / 2;
    }
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

}

//在触摸屏上绘制圆形
function drawArcOnTouchDevice() {
    let currentX;
    let currentY;
    let currentRadius;
    canvas.ontouchstart = (e) => {
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
    canvas.ontouchmove = (e) => {
        ctx.clearRect(currentX - currentRadius, currentY - currentRadius, currentRadius * 2, currentRadius * 2);
        currentX = last[0] + (e.touches[0].clientX - last[0]) / 2;
        currentY = last[1] + (e.touches[0].clientY - last[1]) / 2;
        currentRadius = (e.touches[0].clientX - last[0]) / 2 + 2;
        drawArc(e)
    }
    canvas.ontouchend = e => {
        if (e.touches.length > 0) {
            drawArc(e)
        }
        currentRadius = undefined;
    }
}
//在非触摸屏上绘制圆形
function drawArcOnClickDevice() {
    let currentX;
    let currentY;
    let currentRadius;
    canvas.onmousemove = (e) => {
        if (painting === true) {
            ctx.clearRect(currentX - currentRadius, currentY - currentRadius, currentRadius * 2, currentRadius * 2);
            currentX = last[0] + (e.clientX - last[0]) / 2;
            currentY = last[1] + (e.clientY - last[1]) / 2;
            currentRadius = (e.clientX - last[0]) / 2 + 2;
            drawArc(e)
        }
    }
    canvas.onmousedown = (e) => {
        last = [e.clientX, e.clientY];
        painting = true;
    }
    canvas.onmouseup = e => {
        drawArc(e)
        painting = false;
        currentRadius = undefined;
    }
}

//绘制三角形
function drawTriangle(e, is90) {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = currentColor;
    ctx.moveTo(last[0], last[1])
    let x;
    let y;
    let secondPointX
    if (isTouchDevice) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    if (is90) {
        secondPointX = last[0]
    } else {
        secondPointX = last[0] - (x - last[0])
    }
    let secondPointY = y
    ctx.lineTo(secondPointX, secondPointY)
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
}

//在非触摸屏上绘制三角形
function drawTriangleOnClickDevice(is90) {
    let clearPointX
    let clearPointY
    let clearWidth
    let clearHeight
    canvas.onmousemove = (e) => {
        if (painting === true) {
            ctx.clearRect(clearPointX, clearPointY, clearWidth, clearHeight)
            let secondPointX
            if (is90) {
                secondPointX = last[0]
            } else {
                secondPointX = last[0] - (e.clientX - last[0])
            }
            drawTriangle(e, is90)
            clearPointX = secondPointX - 1;
            clearPointY = last[1] - 1
            clearWidth = e.clientX - secondPointX + 2;
            clearHeight = e.clientY - last[1] + 2
        }
    }
    canvas.onmousedown = (e) => {
        last = [e.clientX, e.clientY];
        painting = true;
    }
    canvas.onmouseup = e => {
        drawTriangle(e, is90)
        //如果不设为 undefined，那么会导致画布上只能画出一个三角形
        clearPointX = undefined
        painting = false;
    }
}

//在触摸屏上绘制三角形
function drawTriangleOnTouchDevice(is90) {
    let clearPointX
    let clearPointY
    let clearWidth
    let clearHeight
    canvas.ontouchstart = (e) => {
        last = [e.touches[0].clientX, e.touches[0].clientY];
    }
    canvas.ontouchmove = (e) => {
        ctx.clearRect(clearPointX, clearPointY, clearWidth, clearHeight)
        let secondPointX;
        if (is90) {
            secondPointX = last[0]
        } else {
            secondPointX = last[0] - (e.touches[0].clientX - last[0])
        }
        drawTriangle(e, is90)
        clearPointX = secondPointX - 2;
        clearPointY = last[1] - 2
        clearWidth = e.touches[0].clientX - secondPointX + 2;
        clearHeight = e.touches[0].clientY - last[1] + 2
    }
    canvas.ontouchend = e => {
        if (e.touches.length > 0) {
            drawTriangle(e, is90)
        }
        clearPointX = undefined
    }
}