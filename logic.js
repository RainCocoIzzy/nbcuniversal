var prod = false;
var squares = [];
var spots = [];

var slots = [null,null,null,null];

var mainspotx = 200;
var mainspoty = 0;

var maindown = false;

var colors = ["#EC4C3C","#E67E22","#F1C40E","#aaaaaa"]

var swiping=false;
var animDir='up';
var animating = false;
var startX=0;
var startY=0;

var mainimg;
var mainimg2;

var swipeTime=0;
var hold = false;
var drag = false;

function Rect(x,y,w,h){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.centerx = x+w/2;
    this.centery = y+h/2;
}

function updateEmptySlots(){
    var found = false;
    for(var i =0; i<slots.length-1; i++){
        if(slots[i]==null && slots[i+1]!=null){
            slots[i+1].lastIndex=i;
            slots[i]=slots[i+1];
            slots[i+1]=null;
            found=true;
            break;
        }
    }
    if(found){
        updateEmptySlots();
    }
}

function shiftSlots(index){
    for(i =slots.length-1;i>index; i--){
        slots[i]=slots[i-1];
        if(slots[i]!=null){
            slots[i].lastIndex=i;
        }
    }
}

function getClosestSlot(x,y){
    var closestDist = -1;
    var closestIndex = -1;
    for(var i =0;i<3;i++){
        var spot = spots[i];
        var xd = spot.centerx-x;
        var yd= spot.centery-y;
        var d = xd*xd+yd*yd;
        var radius = 50;
        if(d<radius*radius){
            if(d<closestDist || closestIndex==-1){
                closestIndex=i;
                closestDist=d;
            }
        }
    }
    return closestIndex;
}

function updateSlots(){
    for(var i=0;i<4;i++){
        if(slots[i]!=null){
            slots[i].toX=spots[i].x;
            slots[i].toY=spots[i].y;
        }
    }
}

function convertPxToInt(pxStr){
    return parseInt(pxStr.substr(0,pxStr.length-2));
}

function enterframe(){
    if(!maindown){
        updateEmptySlots(0);
    }
    updateSlots();
    var mvspd=5;
    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        if(!square.down){
            var topInt = convertPxToInt(square.css('top'));
            var leftInt = convertPxToInt(square.css('left'));
            var xd = square.toX-leftInt;
            var yd = square.toY-topInt;
            var newX = xd/mvspd+leftInt;
            var newY = yd/mvspd+topInt;
            square.css('left',newX+'px');
            square.css('top',newY+'px');
        }
    }

    if(hold){
        swipeTime++;
        var waitTime=30;
        if(swipeTime>waitTime){
            swiping=false;
            if(!drag){
                createSquare(startX,startY);
                drag=true;
            }
        }
    }

    if(animating){
        var toY = -500;
        if(animDir=="down"){
            toY=500;
        }
        var loc = convertPxToInt(mainimg.css('top'));
        var newLoc =loc-Math.ceil((loc-toY)/mvspd);
        mainimg.css('top',newLoc);

        var loc2 = convertPxToInt(mainimg2.css('top'));
        if(animDir=="up"){
            var newLoc =loc2-Math.ceil((loc2)/mvspd);
        } else {
            var newLoc =loc2-Math.floor((loc2)/mvspd);
        }
        mainimg2.css('top',newLoc);
        if(newLoc==0){
            animating=false;
            mainimg.css('top',0);
            mainimg2.css('top',0);
            mainimg2.css('display','none');
            swiping=false;
        }
    } else {
        if(!swiping){
            var topInt = convertPxToInt(mainimg.css('top'));
            mainimg.css('top',(topInt)/mvspd+'px');
        }
    }
}


function createSquare(sx,sy){
    var square = document.createElement("div");
    document.body.appendChild(square);
    square.setAttribute('class','square');
    var name = 'square'+Math.round(Math.random()*1000000);
    square.setAttribute('id',name);
    var square = $('#'+name);
    square.down=true;
    square.diffX=25;
    square.diffY=25;
    square.toX=startX;
    square.toY=startY;
    square.lastIndex=-1;
    square.width=50;
    square.height=50;
    square.css('background',colors[0]);
    square.css('left',(sx-25)+'px');
    square.css('top',(sy-25)+'px');
    squares.push(square);
}

$(document).ready(function(){
    if(prod){
        $(document).on({ 'touchstart' : touch});
        $(document).on({ 'touchmove' : touchmove});
        $(document).on({ 'touchend' : touchend});
        $(document).on({ 'touchcancel' : touchend});
    } else {
        $(document).on({ 'mousedown' : touch});
        $(document).on({ 'mousemove' : touchmove});
        $(document).on({ 'mouseup' : touchend});
    }

    for(var i =1;i<5;i++){
        var spot = $('#spot'+i);
        var topInt = convertPxToInt(spot.css('top'));
        var leftInt = convertPxToInt(spot.css('left'));
        spots.push (new Rect(leftInt,topInt,100,100));
    }

    mainimg = $("#mainimg");
    mainimg2 = $("#mainimg2");
    mainimg2.css('display','none');

    window.setInterval(enterframe,10);
});



function touch(ev){
    ev.preventDefault();
    if(maindown){
        return;
    }
    if(prod){
        startX = ev.originalEvent.touches[0].pageX;
        startY = ev.originalEvent.touches[0].pageY;
    } else {
        startX = ev.pageX;
        startY = ev.pageY;
    }
    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        var topInt = convertPxToInt(square.css('top'));
        var leftInt = convertPxToInt(square.css('left'));
        square.diffX = startX - leftInt;
        square.diffY = startY - topInt;
        if(square.diffX>0 && square.diffY>0 && square.diffX<square.width && square.diffY<square.height){
            square.down=true;
            maindown=true;
            return;
        }
    }
    if(startX>150){
        swiping=true;
        hold=true;
    }
}

function touchmove(ev){
    ev.preventDefault();
    var ex;
    var ey;
    if(prod){
        ex = ev.originalEvent.touches[0].pageX;
        ey = ev.originalEvent.touches[0].pageY;
    } else {
        ex = ev.pageX;
        ey = ev.pageY;
    }

    if(animating){
    } else {
        if(swiping){
            var minmove = 10;
            if(Math.abs(ey-startY)>minmove){
                hold=false;
            }
            var miny = -250;
            var maxy = 250
            mainimg.css('top',ey-startY);
            if(ey-startY<miny){
                animating=true;
                animDir="up";
                mainimg2.css('top',500);
                mainimg2.css('display','block');
            } else if(ey-startY>maxy){
                animating=true;
                animDir="down";
                mainimg2.css('top',-500);
                mainimg2.css('display','block');
            }
        }
    }

    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        if(square.down){
            var newX;
            var newY;
            newX = ex-square.diffX;
            newY = ey-square.diffY;
            square.css('left',newX+'px');
            square.css('top',newY+'px');
            var slotIndex = getClosestSlot(newX+square.width/2,newY+square.height/2);
            var lastIndex = square.lastIndex;
            updateEmptySlots();//lastIndex);
            if(slotIndex == lastIndex){
                // same - no change
            } else{
                // new addition
                if(slotIndex!=-1){
                    if(square.lastIndex!=-1){
                        slots[lastIndex]=null;
                        square.lastIndex=-1;
                        updateEmptySlots();//slotIndex);
                    }
                    if(slots[slotIndex]!=null){
                        shiftSlots(slotIndex);
                    }
                    slots[slotIndex]=square;
                    square.lastIndex=slotIndex;
                } else {
                    square.toX = mainspotx;
                    square.toY = mainspoty;
                    square.lastIndex=-1;
                    if(lastIndex!=-1){
                        slots[lastIndex]=null;
                    }
                }
            }
            updateEmptySlots();//lastIndex);
        }
    }
}

function touchend(ev){
    ev.preventDefault();
    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        square.down=false;
        if(square.lastIndex==-1 || square.lastIndex==3){
            squares.splice(i,1);
            square.remove();
            i--;
        }
    }
    maindown=false;
    swiping=false;
    swipeTime=0;
    drag=false;
    hold=false;
}
