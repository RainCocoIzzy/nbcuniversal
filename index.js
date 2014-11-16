var imgURL;

function Movie(){
    this.title="";
    this.rating="";
    this.img="";
    this.imageObj= new Image();
    this.imageObj.setAttribute('crossOrigin', 'anonymous');
    this.id="";
    this.url = ""
}
var movies = [null,null,null];

var imgs = [null, null, null];
var responses = 0;

function createMovie(num,title,rating,photo,id){
    if(photo=="http://images.fandango.com/r94.9/ImageRenderer/750/500/nox.jpg/2148/images/masterrepository/fandango/2148/billye2.jpg"){
        return;
    }
    var movie = new Movie();
    movie.title=title;
    movie.img;//
    imgs[num-1] = "./lib/image"+id+".png";
    movie.id=id;
    var rejoin =photo.split(" ").join("%20");
    var post = 'savelib.php?loc='+movie.id+'&url='+rejoin;
    console.log(rejoin);
    $.ajax({type:'GET',url:post,success:loadRealImg});
    movies[num-1]=movie;
    console.log(imgs[num-1]);
}

function loadRealImg(){
    responses++;
    if(responses==3){
        var sources = { first: imgs[0], second: imgs[1], third:imgs[2], firstplace:'images/first.png',secondplace:'images/second.png',thirdplace:'images/third.png'};
        var titles = [movies[0].title,movies[1].title,movies[2].title];
        createPNG(sources, titles);

    }
}

function fb_login() {
   FB.getLoginStatus(function(response) {
     if (response.status === 'connected') {
         fb_publish();
     } else {
        FB.login(function(response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                    console.log('Good to see you, ' + response.name + '.');
                },{scope :'publish_actions'});
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
     }
   });
}

function fb_publish() {
    FB.ui({
        method: 'feed',
        link: 'http://danny-yaroslavski.com/dragdrop/landingpage.php?m1='+movies[0].id+'&m2='+movies[1].id+"&m3="+movies[2].id,
        picture: imgURL,
        caption: '#Top3IWantToSee',
    }, function(response){});
}

$(document).ready( function() {

    $("#facebooklink").click( function() { 
        fb_login();
    });
    $("#twitterlink").click( function() {
        $.ajax({
            type: "POST",
            url: "https://api.twitter.com/1.1/direct_messages/new.json?",
            data: "text=hello%2C%20tworld.%20welcome%20to%201.1.&screen_name=theseancook",
            success: function() {alert('success')},
            dataType: ""
        });
    });
});


function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for (var src in sources) {
        numImages++;
    }

    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

var randomNum;

function createPNG(sources, titles) {
    $(".share").click( function() {
        var expand = $(this).find('.expand');
        if( expand.css('z-index') == '-1') {
            $(this).find('.expand').css({'transform':'scale(100)','z-index':'1'});
        } else {
            $(this).find('.expand').css({'transform':'scale(0)','z-index':'-1'});
        }
    });

    canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.font="20px Futura";
    ctx.fillStyle="white";

    var pad = 5;
    var pad2 = pad*2;
    var ch = canvas.height;
    var cw = canvas.width;


    loadImages(sources, function(images) {
        var lingrad2 = ctx.createLinearGradient(0,0,0,70);
            lingrad2.addColorStop(0, 'rgba(0,0,0,0)');
            lingrad2.addColorStop(1, 'rgba(0,0,0,0.3)');

        //First
        var frameW = cw*(3/5)-pad;
        var frameH = ch-pad2;
        var imgSize = getSize(frameW,frameH,images.first.width,images.first.height);
        ctx.drawImage(images.first, 0, 0, imgSize[0],imgSize[1], pad, pad, images.first.width, images.first.height);
        ctx.fillStyle=lingrad2;
        ctx.fillRect(pad,frameH-76+pad,frameW,76);
        ctx.fillStyle="white";
        ctx.fillText(titles[0],cw/6,ch-pad*5);
        ctx.drawImage(images.firstplace, cw*(3/5)-images.firstplace.width, ch-pad-images.firstplace.height);

        //Second
        frameW = cw*(3/5)-120;
        frameH = ch*(3/5)-pad;
        imgSize = getSize(frameW,frameH,images.second.width,images.second.height);
        ctx.drawImage(images.second, 0, 0, imgSize[0],imgSize[1], cw*(3/5)+pad, pad, images.second.width, images.second.height);
        ctx.fillStyle=lingrad2;
        ctx.fillRect(cw*(3/5)+pad,frameH-76+pad,frameW,76);
        ctx.fillStyle="white";
        ctx.fillText(titles[1],cw*(4/6),ch*(3/5)-pad*5);
        ctx.drawImage(images.secondplace, cw-pad-images.secondplace.width, ch*(3/5)-images.secondplace.height);

        //Third
        frameW = cw*(3/5)-120;
        frameH = ch*(2/5)-pad2;
        imgSize = getSize(frameW,frameH,images.third.width,images.third.height);
        ctx.drawImage(images.third, 0, 0, imgSize[0], imgSize[1], cw*(3/5)+pad, ch*(3/5)+pad, images.third.width, images.third.height);
        ctx.fillStyle=lingrad2;
        ctx.fillRect(cw*(3/5)+pad,ch-76-pad,frameW,76);
        ctx.fillStyle="white";
        ctx.fillText(titles[2],cw*(4/6),ch-pad*5);
        ctx.drawImage(images.thirdplace, cw-pad-images.thirdplace.width, ch-pad-images.thirdplace.height);

        var finalImg = canvas.toDataURL("image/png");
        var ajax = new XMLHttpRequest();
        randomNum = Math.round(Math.random()*10000000);
        ajax.open("POST",'saveimg.php?loc='+randomNum,false);
        ajax.setRequestHeader('Content-Type', 'application/upload');
        ajax.onreadystatechange=function(){
            if (ajax.readyState==4 && ajax.status==200){
                var myString = location.href;
                var split = myString.split("/");
                split.pop();
                var loc = split.join("/");
                imgURL = loc+"/created/image"+randomNum+".png";
                console.log(imgURL);
            }
        }
        ajax.send(finalImg);

    });
}

function getSize(frameW,frameH,imgW,imgH) {
    /*var rf = frameW/frameH;
    var ri = imgW/imgH;
    return rf < ri ? [imgW * frameH/imgH,frameH] : [frameW, imgH * frameW/imgW];
    */
    var scale = 1;
    var ratioX = imgW/frameW;
    var ratioY = imgH/frameH;

    if(ratioX < 1) scale = 1/ratioX;
    if(ratioY*scale < 1) scale *= 1/ratioY;
    return [scale*imgW*ratioX,scale*imgH*ratioY];
}
