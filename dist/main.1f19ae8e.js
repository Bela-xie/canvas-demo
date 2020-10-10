// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"main.js":[function(require,module,exports) {
//初始化
var canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
var painting = false;
var isTouchDevice = ("ontouchstart" in document.documentElement);
var last;
var currentColor = "black";
var currentLineWidth = 6; //设置颜色

setColor(); //监听按钮点击事件

listenButtonClick(); //初始化画板

var ctx = canvas.getContext("2d");
var drawOnDevicesMap = {
  drawLineOnDevices: isTouchDevice ? drawLineOnTouchDevice : drawLineOnClickDevice,
  drawRectOnDevices: isTouchDevice ? drawRectOnTouchDevice : drawRectOnClickDevice,
  drawArcOnDevices: isTouchDevice ? drawArcOnTouchDevice : drawArcOnClickDevice,
  drawTriangleOnDevices: isTouchDevice ? drawTriangleOnTouchDevice : drawTriangleOnClickDevice // drawTriangle90OnDevices: isTouchDevice ? drawTriangle90OnTouchDevice : drawTriangle90OnClickDevice,

};
drawOnDevicesMap["drawLineOnDevices"](); //添加active类

function addActive(btn) {
  var btns = document.querySelectorAll("button");

  for (var i = 0; i < btns.length; i++) {
    if (btns[i].classList.contains("active")) {
      btns[i].classList.remove("active");
    }
  }

  btn.classList.add("active");
} //监听按钮点击事件


function listenButtonClick() {
  var smallBtn = document.getElementById("small");
  var mediumBtn = document.getElementById("medium");
  var bigBtn = document.getElementById("big");
  var rectBtn = document.getElementById("rect");
  var arcBtn = document.getElementById("arc");
  var triangleBtn = document.getElementById("triangle");
  var triangle90Btn = document.getElementById("triangle-90");

  smallBtn.onclick = function (e) {
    currentLineWidth = e.currentTarget.dataset.size;
    addActive(e.currentTarget);
    drawOnDevicesMap["drawLineOnDevices"]();
  };

  mediumBtn.onclick = function (e) {
    currentLineWidth = e.currentTarget.dataset.size;
    addActive(e.currentTarget);
    drawOnDevicesMap["drawLineOnDevices"]();
  };

  bigBtn.onclick = function (e) {
    currentLineWidth = e.currentTarget.dataset.size;
    addActive(e.currentTarget);
    drawOnDevicesMap["drawLineOnDevices"]();
  };

  rectBtn.onclick = function (e) {
    addActive(e.currentTarget);
    drawOnDevicesMap["drawRectOnDevices"]();
  };

  arcBtn.onclick = function (e) {
    addActive(e.currentTarget);
    drawOnDevicesMap["drawArcOnDevices"]();
  };

  triangleBtn.onclick = function (e) {
    addActive(e.currentTarget);
    drawOnDevicesMap["drawTriangleOnDevices"](false);
  };

  triangle90Btn.onclick = function (e) {
    addActive(e.currentTarget);
    drawOnDevicesMap["drawTriangleOnDevices"](true);
  };
} //设置颜色


function setColor() {
  var colorInput = document.getElementById("color");
  currentColor = colorInput.value;

  colorInput.oninput = function (e) {
    currentColor = e.target.value;
  };
} //绘制线


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
} //在触摸屏上绘制线


function drawLineOnTouchDevice() {
  canvas.ontouchstart = function (e) {
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };

  canvas.ontouchmove = function (e) {
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    drawLine(last[0], last[1], x, y);
    last = [x, y];
  };
} //在非触摸屏上绘制线


function drawLineOnClickDevice() {
  canvas.onmousemove = function (e) {
    if (painting === true) {
      drawLine(last[0], last[1], e.clientX, e.clientY);
      last = [e.clientX, e.clientY];
    }
  };

  canvas.onmousedown = function (e) {
    last = [e.clientX, e.clientY];
    painting = true;
  };

  canvas.onmouseup = function () {
    painting = false;
  };
} //在触摸屏上绘制矩形


function drawRectOnTouchDevice() {
  var lastWidth;
  var lastHeight;
  ctx.lineWidth = 2;

  canvas.ontouchstart = function (e) {
    ctx.strokeStyle = currentColor;
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };

  canvas.ontouchmove = function (e) {
    var x = e.touches[0].clientX;
    var y = e.touches[0].clientY;
    ctx.clearRect(last[0], last[1], lastWidth, lastHeight);
    ctx.strokeRect(last[0], last[1], x - last[0], y - last[1]);
    lastWidth = x - last[0];
    lastHeight = y - last[1];
  };

  canvas.ontouchend = function (e) {
    if (e.touches.length > 0) {
      ctx.strokeRect(last[0], last[1], e.touches[0].clientX - last[0], e.touches[0].clientY - last[1]);
    }
  };
} //在非触摸屏上绘制矩形


function drawRectOnClickDevice() {
  var lastWidth;
  var lastHeight;
  ctx.lineWidth = 2;

  canvas.onmousemove = function (e) {
    if (painting === true) {
      ctx.clearRect(last[0], last[1], lastWidth, lastHeight);
      ctx.strokeRect(last[0], last[1], e.clientX - last[0], e.clientY - last[1]);
      lastWidth = e.clientX - last[0];
      lastHeight = e.clientY - last[1];
    }
  };

  canvas.onmousedown = function (e) {
    ctx.strokeStyle = currentColor;
    last = [e.clientX, e.clientY];
    painting = true;
  };

  canvas.onmouseup = function (e) {
    ctx.strokeRect(last[0], last[1], e.clientX - last[0], e.clientY - last[1]);
    painting = false;
  };
} //绘制圆形


function drawArc(e) {
  ctx.lineWidth = 2;
  ctx.strokeStyle = currentColor;
  ctx.beginPath();
  var x;
  var y;
  var radius;

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
} //在触摸屏上绘制圆形


function drawArcOnTouchDevice() {
  var currentX;
  var currentY;
  var currentRadius;

  canvas.ontouchstart = function (e) {
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };

  canvas.ontouchmove = function (e) {
    ctx.clearRect(currentX - currentRadius, currentY - currentRadius, currentRadius * 2, currentRadius * 2);
    currentX = last[0] + (e.touches[0].clientX - last[0]) / 2;
    currentY = last[1] + (e.touches[0].clientY - last[1]) / 2;
    currentRadius = (e.touches[0].clientX - last[0]) / 2 + 2;
    drawArc(e);
  };

  canvas.ontouchend = function (e) {
    if (e.touches.length > 0) {
      drawArc(e);
    }

    currentRadius = undefined;
  };
} //在非触摸屏上绘制圆形


function drawArcOnClickDevice() {
  var currentX;
  var currentY;
  var currentRadius;

  canvas.onmousemove = function (e) {
    if (painting === true) {
      ctx.clearRect(currentX - currentRadius, currentY - currentRadius, currentRadius * 2, currentRadius * 2);
      currentX = last[0] + (e.clientX - last[0]) / 2;
      currentY = last[1] + (e.clientY - last[1]) / 2;
      currentRadius = (e.clientX - last[0]) / 2 + 2;
      drawArc(e);
    }
  };

  canvas.onmousedown = function (e) {
    last = [e.clientX, e.clientY];
    painting = true;
  };

  canvas.onmouseup = function (e) {
    drawArc(e);
    painting = false;
    currentRadius = undefined;
  };
} //绘制三角形


function drawTriangle(e, is90) {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = currentColor;
  ctx.moveTo(last[0], last[1]);
  var x;
  var y;
  var secondPointX;

  if (isTouchDevice) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else {
    x = e.clientX;
    y = e.clientY;
  }

  if (is90) {
    secondPointX = last[0];
  } else {
    secondPointX = last[0] - (x - last[0]);
  }

  var secondPointY = y;
  ctx.lineTo(secondPointX, secondPointY);
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.stroke();
} //在非触摸屏上绘制三角形


function drawTriangleOnClickDevice(is90) {
  var clearPointX;
  var clearPointY;
  var clearWidth;
  var clearHeight;

  canvas.onmousemove = function (e) {
    if (painting === true) {
      ctx.clearRect(clearPointX, clearPointY, clearWidth, clearHeight);
      var secondPointX;

      if (is90) {
        secondPointX = last[0];
      } else {
        secondPointX = last[0] - (e.clientX - last[0]);
      }

      drawTriangle(e, is90);
      clearPointX = secondPointX - 1;
      clearPointY = last[1] - 1;
      clearWidth = e.clientX - secondPointX + 2;
      clearHeight = e.clientY - last[1] + 2;
    }
  };

  canvas.onmousedown = function (e) {
    last = [e.clientX, e.clientY];
    painting = true;
  };

  canvas.onmouseup = function (e) {
    drawTriangle(e, is90); //如果不设为 undefined，那么会导致画布上只能画出一个三角形

    clearPointX = undefined;
    painting = false;
  };
} //在触摸屏上绘制三角形


function drawTriangleOnTouchDevice(is90) {
  var clearPointX;
  var clearPointY;
  var clearWidth;
  var clearHeight;

  canvas.ontouchstart = function (e) {
    last = [e.touches[0].clientX, e.touches[0].clientY];
  };

  canvas.ontouchmove = function (e) {
    ctx.clearRect(clearPointX, clearPointY, clearWidth, clearHeight);
    var secondPointX;

    if (is90) {
      secondPointX = last[0];
    } else {
      secondPointX = last[0] - (e.touches[0].clientX - last[0]);
    }

    drawTriangle(e, is90);
    clearPointX = secondPointX - 2;
    clearPointY = last[1] - 2;
    clearWidth = e.touches[0].clientX - secondPointX + 2;
    clearHeight = e.touches[0].clientY - last[1] + 2;
  };

  canvas.ontouchend = function (e) {
    if (e.touches.length > 0) {
      drawTriangle(e, is90);
    }

    clearPointX = undefined;
  };
}
},{}],"C:/Users/小仙女/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57466" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/小仙女/AppData/Local/Yarn/Data/global/node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map