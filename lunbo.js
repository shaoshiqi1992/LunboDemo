var dom = document.getElementById("slider");
var liArr = dom.getElementsByTagName("li");
var panel=document.getElementById("panel");
var dots=panel.getElementsByTagName("li");
var curWidth = window.innerWidth;
var ulWidth = curWidth * liArr.length;
var show = [];
var circle = [];
var posX,touchX;

dom.style.width = ulWidth + "px";
dom.parentNode.style.width =curWidth+"px";
panel.parentNode.style.width =curWidth+"px";
panel.parentNode.style.marginLeft =-curWidth/2+"px";

//初始化

//原始位置
function originalPos(){
    for(var i = 0, len = liArr.length; i < len; i++){
        var curLi = liArr[i];
        curLi.setAttribute("data-index", i);
        curLi.style.width = curWidth + "px";

        if(i == 0){
            curLi.style.left = 0;
            show.push(curLi);
        }else{
            curLi.style.left = - curWidth*i  + "px";
            if(i > 1){
                translate(curLi, 'goAway', '');
                circle.push(curLi);
            }else{
                show.push(curLi);
                translate(curLi, 'goPre', '');
            }
        }
    }
}

circle.reverse();
originalPos();
var autoPlay=setInterval(changeToNext,3000);
window.onload=autoPlay;
//导航栏控制

dotsChangeColor();
for(var i=0;i<dots.length;i++){
    dots[i].onclick=(function(i){
        return function () {
            while(show[0].getAttribute("data-index")!=i){
                changeToNext("0ms","0ms");
                dotsChangeColor(i);
            }
        }
    }(i));
}

//导航栏变色
function dotsChangeColor(num){
    var i=num||show[0].getAttribute("data-index");
    if (document.getElementsByClassName("active")[0]) {
        var active = document.getElementsByClassName("active")[0];
        active.classList.remove("active")
    }
    dots[i].classList.add("active");
}
//鼠标滑动
var pagination=document.getElementsByClassName("pagination-panel")[0];
pagination.onmousedown=function(e){
    if(!e) e = window.event; //IE
    e.preventDefault();
    posX = e.clientX;
    clearInterval(autoPlay);
    document.onmousemove = mousemove;
    for(var i=0; i<3;i++){
        changeToNext("0ms","0ms");
    }
};
document.onmouseup = function(e)
{
    if(!e) e = window.event;
    if(document.onmousemove){
        if(e.clientX-posX<-curWidth*0.1){
            changeToNext();
            document.onmousemove=null;
        }else if(e.clientX-posX>curWidth*0.1) {
            changeToLast();
            document.onmousemove = null;
        }else{
            slide(0,0);
            document.onmousemove = null;
        }
    }
    autoPlay=setInterval(changeToNext,3000);
};
function mousemove(ev){
    if(ev==null) ev = window.event;//IE
    slide(ev.clientX,posX);
}
function touchmove(e){
    //console.log(e.changedTouches[0].clientX,posX);
    slide(e.changedTouches[0].clientX,touchX);
}
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
pagination.addEventListener('touchstart', function(e) {
    document.onmousemove = null;
    touchX =e.touches[0].pageX;
    clearInterval(autoPlay);
    for(var i=0; i<3;i++){
        changeToNext("0ms","0ms");
    }
    pagination.addEventListener('touchmove',touchmove,false);
}, false);
pagination.addEventListener('touchend',function(e){
    if(e.changedTouches[0].clientX-touchX<-curWidth*0.2){
        changeToNext();
        pagination.removeEventListener('touchmove', touchmove,false);
    }else if(e.changedTouches[0].clientX-touchX>curWidth*0.2) {
        changeToLast();
        pagination.removeEventListener('touchmove', touchmove,false);
    }else{
        slide(0,0);
        pagination.removeEventListener('touchmove', touchmove,false);
    }
    document.onmousemove =mousemove;
    autoPlay=setInterval(changeToNext,3000);
},false);
//动画效果

//鼠标滑动
function slide(a,b){
    var len = a-b;
    getTransform(show[0],"translate("+len+"px,0)");
    getTransform(show[1],"translate("+(curWidth+len)+"px,0)");
    getTransform(circle[0],"translate("+(-curWidth+len)+"px,0)");
}
//向左
function changeToNext(moveOutTime,moveInTime){

    var oTime = moveOutTime||"300ms";
    var iTime = moveInTime ||"300ms";
    var showFirst = show.shift();
    translate(showFirst, 'goAway', oTime);
    translate(show[0], 'goIn', iTime);
    circle.splice(0, 0, showFirst);
    var nextPre = circle.pop();
    translate(nextPre, 'goPre', "0ms");
    show.push(nextPre);
    dotsChangeColor();
}
//向右
function changeToLast(moveOutTime,moveInTime){
    var oTime = moveOutTime||"300ms";
    var iTime = moveInTime ||"300ms";
    var lastShow = circle.shift();
    translate(lastShow, 'goIn', iTime);
    translate(show[0], 'goPre',oTime);
    show.splice(0, 0, lastShow);
    var nextPre = show.pop();
    translate(nextPre, 'goAway', "0ms");
    circle.push(nextPre);
    dotsChangeColor();
}
function translate(dom, goType, time,length){
    var len = length || curWidth;
    getTransform(dom,anim(goType,len));
    dom.style.transitionDuration = time;
}
function getTransform(dom,anim){
    dom.style.transform =
        dom.style.webkitTransform =
            dom.style.MozTransform =
                dom.style.msTransform =
                    dom.style.OTransform = anim;
}
function anim(goType,length){
    var res ="";
    switch (goType){
        case "goAway":
            res="translate(-" + length +"px, 0)";
            break;
        case "goIn":
            res = "translate(0, 0)";
            break;
        case "goPre":
            res = "translate(" + length +"px, 0)";
            break;
        default:
    }
    return res;
}