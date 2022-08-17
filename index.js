const maxRotateX = 125;
const minRotateX = 55;
const resetRotateX = 80;//mouse up reset rotate
const imgCount = 56;
var pageIndex = 0;//photo page
var isMove = false;

window.onload = function () {
   initPage();
   initEvents();
   setPs();
   move();
   //drop();
   loadImg();
}

function initPage() {
   for (let index = 0; index < $(".letter").length; index++) {
      var element = $(".letter")[index];
      $(element).css("color", randomHexColor());
   }
}

function setPs() {
   for (let index = 0; index < $(".z span").length; index++) {
      $(".z span")[index].style.transform = 'rotateX(-90deg) rotateY(' + index*30 + 'deg) translateZ(400px)';
   }
}

function initEvents() {
   //close preview
   $("#close").on("click touchstart", () => {
      $("#background").css({"opacity":"0"});
      setTimeout(() => {
         $("#background").css({"display":"none"});
      }, 500);
   });

   $(".z span").on("mouseup touchend", function (e) {
      e.preventDefault();
      if (isMove) {
         return;
      }
      $("#background").css({"display":"flex"});
      setTimeout(() => {
         $("#background").css({"opacity":"1"});
      }, 5);
      var img = this.style["background-image"];
      $("#previewimg").attr("src",`${img.replace("url(\"","").replace("\")","")}`);
   })
}

function move() {
   var zBox = document.querySelector('.z');
   var xBox = document.querySelector('.di');
   var speedTimer = null;
   var speedX = 0,speedY = 0;
   var xDeNow = 90, zDegNow = 0;
   var xDegDis = 0, zDegDis = 0;
   $(".box").on("mousedown touchstart", function (e) {
      xBox.style.transition = '';
      zBox.style.transition = '';
      var xstart = e.type == "mousedown" ? e.clientX : e.originalEvent.changedTouches[0].pageX;
      var speedX_start = xstart;
      var ystart = e.type == "mousedown" ? e.clientY : e.originalEvent.changedTouches[0].pageY;
      var speedY_start = ystart;
      var tstart = new Date().getTime();
      var tnow = tstart;
      speedTimer = setInterval(() => {
         tnow = new Date().getTime();
      }, 10);

      $(".box").on("mousemove touchmove", function(e){
         var xnow = e.type == "mousemove" ? e.clientX : e.originalEvent.changedTouches[0].pageX;
         var ynow = e.type == "mousemove" ? e.clientY : e.originalEvent.changedTouches[0].pageY;
         var xD = xnow - xstart;
         var yD = ynow - ystart;
         if (!yD && !xD) {
            return;
         }
         isMove = true;
         if (tnow - tstart >= 10) {
            speedX = (xnow - speedX_start) / (tnow - tstart);
            speedY = (ynow - speedY_start) / (tnow - tstart);
            tstart = tnow;
            speedX_start = xnow;
            speedY_start = ynow;
         }
         zDegDis = zDegNow - (xD / 10);
         zBox.style.transform = "rotateZ(" + zDegDis + "deg)";
         reloadImg(zDegDis);
         xDegDis = xDeNow - (yD/10);
         xDegDis = xDegDis > maxRotateX ? maxRotateX : xDegDis < minRotateX ? minRotateX : xDegDis;
         xBox.style.transform = "translate(-50%, -50%) rotateX(" + xDegDis + "deg)";
      });
   });
   $(".box").on("mouseup touchend", function (e) {
      clearTimeout(speedTimer);
      $(".box").off("mousemove touchmove");
      if(isMove){
         xBox.style.transition = "all .6s ease-out";
         zBox.style.transition = "all .6s ease-out";
         zDegDis = zDegDis - (speedX * 10);
         zBox.style.transform = "rotateZ(" + zDegDis + "deg)";
         reloadImg(zDegDis);
         // xDegDis = xDegDis - (speedX * 10);
         // xDegDis = xDegDis > maxRotateX ? maxRotateX : xDegDis < minRotateX ? minRotateX : xDegDis;
         xBox.style.transform = "translate(-50%, -50%) rotateX(" + resetRotateX + "deg)";
         xDeNow = resetRotateX;
         zDegNow = zDegDis;
         isMove = false;
         speedX = 0;
         speedY = 0;
         xDegDis = 0;
      }
   })
}

function drop() {
   window.ondragover = function (e) {
      e.preventDefault();
   }
   window.ondrop = function (e) {
      e.preventDefault();
   }
   var ps = document.getElementsByTagName("p");
   for (let index = 0; index < ps.length; index++) {
      ps[index].index = index;
      ps[index].ondrop = function (e) {
         var w = new FileReader();
         w.index = this.index;
         w.readAsDataURL(e.dataTransfer.files[0]);
         w.onload = function() {
            ps[this.index].style.backgroundImage = "url(" + w.result + ")";
            ps[this.index].innerHTML = "";
         }
      }
      
   }
}

function reloadImg(deg) {
   var currentP = Math.floor(deg/360);
   if (currentP == pageIndex) {
      return;
   }
   pageIndex = currentP;
   loadImg();
}

function loadImg() {
   var perpageCount = $(".z span").length;
   var baseIndex = perpageCount * pageIndex;
   if (pageIndex < 0) {
      baseIndex = Math.abs(perpageCount * pageIndex + imgCount);
   }

   for (let index = 0; index < $(".z span").length; index++) {
      var element = $(".z span")[index];
      var loader = $(element).find(".center")[0];
      element.style.backgroundImage = "none";
      $(loader).show();
      var url = getImageURL((baseIndex + index) % imgCount);
      let image=new Image();
      image.src=url;
      image.el=element;
      image.src=url;
      image.url=url;
      image.loader=loader;
      image.onload = (e) => {
         setTimeout(() => {
            e.path[0].el.style.backgroundImage = "url(" + e.path[0].url + ")";
            $(e.path[0].loader).hide();
         }, 0);
         
      };
   }
}

function getImageURL(index) {
   return `./img/${index + 1}.jpg`;
}

function randomHexColor() {
   let color = 'rgb(' +
   Math.round(Math.random() * 255) +
   ', ' +
   Math.round(Math.random() * 255) +
   ', ' +
   Math.round(Math.random() * 255) +
   ', ' + '0.5' +
   ')';

   return color;
 }