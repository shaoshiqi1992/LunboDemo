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

/**
 * 原始位置
 * 用两个数组
 * 数组1存储在舞台上的和即将进场的图片
 * 数组2存储其他图片
 * 假设有4张图片，初始化数组1存储为1,2数组2存储为4,3
 */
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
    circle.reverse();
}
originalPos();

//设置定时器自动播放
var autoPlay=setInterval(changeToNext,3000);
window.onload=autoPlay;

//导航栏控制，点击变色
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

/**
 * 鼠标滑动事件
 * 清除定时器
 * 记录鼠标初始位置
 * 根据鼠标位置与其原始位置之差判断轮播操作
 * 鼠标松开重新开始计时
 */
var pagination=document.getElementsByClassName("pagination-panel")[0];
pagination.onmousedown=function(e){
    if(!e) e = window.event; //IE
    e.preventDefault();
    posX = e.clientX;
    clearInterval(autoPlay);
    document.onmousemove = mousemove;
    for(var i=0; i<liArr.length;i++){
        changeToNext("0ms","0ms");
    }
};
//鼠标滑动动画
function mousemove(ev){
    if(ev==null) ev = window.event;//IE
    slide(ev.clientX,posX);
}
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

/**
 * 移动端滑动事件
 * 同上
 */
function touchmove(e){
    slide(e.changedTouches[0].clientX,touchX);
}
document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);
pagination.addEventListener('touchstart', function(e) {
    document.onmousemove = null;
    touchX =e.touches[0].pageX;
    clearInterval(autoPlay);
    for(var i=0; i<liArr.length;i++){
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


/**
 * 滑动动画
 * @method slide
 * @param {Num} a 减数，当前位置
 * @param {Num} b 被减数，原始位置
 */
function slide(a,b){
    var len = a-b;
    getTransform(show[0],"translate("+len+"px,0)");
    getTransform(show[1],"translate("+(curWidth+len)+"px,0)");
    getTransform(circle[0],"translate("+(-curWidth+len)+"px,0)");
}
/**
 * 向左移动一个image
 * 数组第一次变换步骤为:
 * 数组1:2;数组2:4,3
 * 数组1:2;数组2:1,4,3
 * 数组1:2;数组2:1,4
 * 数组1:2,3;数组2:1,4
 * 此后以此类推
 * @method changeToNext
 * @param {String}  moveOutTime，移出时间，默认为300ms
 * @param {String}  moveInTime，移入时间，默认为300ms
 */
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
/**
 * 向右移动一个image
 * 与上一步操作相反
 * @method changeToLast
 * @param {String}  moveOutTime，移出时间，默认为300ms
 * @param {String}  moveInTime，移入时间，默认为300ms
 */
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
/**
 *添加动画
 * @method translate
 * @param {Element} dom 操作对象
 * @param {String} goType 动画名称
 * @param {String} time 动画时间
 */
function translate(dom, goType,time){
    getTransform(dom,anim(goType,curWidth));
    dom.style.transitionDuration = time;
}
/**
 * 设置transform
 * 设置其兼容性
 * @method getTransform
 * @param {Element} dom 操作对象
 * @param {String} anim 动画名称
 */
function getTransform(dom,anim){
    dom.style.transform =
        dom.style.webkitTransform =
            dom.style.MozTransform =
                dom.style.msTransform =
                    dom.style.OTransform = anim;
}
/**
 * 返回动画字符串
 * @method anim
 * @param {String} goType 动画名称
 * @param {String} length translate长度
 * @return {String} translate相关字符串作动画效果
 */
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