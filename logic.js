var prod = false;
var squares = [];
var spots = [];

var slots = [null,null,null,null];

var mainspotx = 200;
var mainspoty = 0;

var maindown = false;

var colors = ["#EC4C3C","#E67E22","#F1C40E","#aaaaaa"]

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
    var mvspd=3;
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

    for(var i =0; i<4; i++){
        var square = document.createElement("div");
        document.body.appendChild(square);
        square.setAttribute('class','square');
        square.setAttribute('id','square'+i);
        var square = $('#square'+i);
        square.down=false;
        square.diffX=0;
        square.diffY=0;
        square.toX=mainspotx;
        square.toY=mainspoty;
        if(i==3){
            square.lastIndex=-1;
        } else {
            square.lastIndex=i;
            slots[i]=square;
        }
        square.width=50;
        square.height=50;
        square.css('background',colors[i]);
        square.css('top',i+'00px');
        squares.push(square);
    }

    for(var i =1;i<6;i++){
        var spot = $('#spot'+i);
        var topInt = convertPxToInt(spot.css('top'));
        var leftInt = convertPxToInt(spot.css('left'));
        spots.push (new Rect(leftInt,topInt,100,100));
    }

    window.setInterval(enterframe,10);
});



function touch(ev){
    ev.preventDefault();
    if(maindown){
        return;
    }
    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        var topInt = convertPxToInt(square.css('top'));
        var leftInt = convertPxToInt(square.css('left'));
        if(prod){
                square.diffX = ev.originalEvent.touches[0].pageX - leftInt;
                square.diffY = ev.originalEvent.touches[0].pageY - topInt;
        } else {
                square.diffX = ev.pageX - leftInt;
                square.diffY = ev.pageY - topInt;
        }
        if(square.diffX>0 && square.diffY>0 && square.diffX<square.width && square.diffY<square.height){
            square.down=true;
            maindown=true;
            return;
        }
    }
}

function touchmove(ev){
    ev.preventDefault();
    for(var i =0;i<squares.length;i++){
        var square = squares[i];
        if(square.down){
            var newX;
            var newY;
            if(prod){
                newX = ev.originalEvent.touches[0].pageX-square.diffX;
                newY = ev.originalEvent.touches[0].pageY-square.diffY;
            } else {
                newX = ev.pageX-square.diffX;
                newY = ev.pageY-square.diffY;
            }
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
    }
    maindown=false;
}
