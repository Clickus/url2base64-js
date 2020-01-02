'use strict';

/**
 * 判断是否http或者https请求
 * @param {*} url 地址
 * return true or false 
 */
function judgeUrl(url) {
  var strUrl = url ? String(url).toLocaleLowerCase() : ''
  if (strUrl&&strUrl.indexOf('http')>=0) {
    return true
  }
  return false
}

/**
 * 判断是否联网 judge online 
 * @param {*} callFn callback 回调
 */
function isOnline(callFn) {
  var img = new Image();
  img.src = 'https://www.baidu.com/favicon.ico?_t=' + Date.now();
  img.onload=function(){
    callFn(true)        
  };
  img.onerror=function(){
    callFn(false)
  };
}

/**
 * 图片URL转base64 canvas方式
 * @param {*} url 图片地址
 * @param {*} callFn 回调
 */
function url2Base64ByCanvas(url, callFn) {
  var img = new Image();
  img.src = url + "?v=" + Math.random(); // 处理缓存
  img.crossOrigin = "*"; // 支持跨域图片
  img.onload = function() {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var dataURL = canvas.toDataURL("image/png");
    callFn(dataURL||'')
  };
}

/**
 * 远程图片地址转base64
 * @param {*} url 图片地址
 * @param {*} callFn 回调
 */
function imgUrl2Base64(url, callFn) {
  if (!judgeUrl(url)) {
    callFn(url||"")
    new Error('图片URL有误')
    return
  }
  window.URL = window.URL || window.webkitURL;
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.onload = function() {
    if (this.status == 200) {
      var blob = this.response;
      let oFileReader = new FileReader();
      oFileReader.onloadend = function(e) {
        callFn(e.target.result);
      };
      oFileReader.readAsDataURL(blob);
    } else {
      url2Base64ByCanvas(url, function(out) {
        callFn(out);
      })
    }
  };
  xhr.send();
}

exports.imgUrl2Base64 = imgUrl2Base64;