$(document).ready( function() {

    var sources = { first: "images/img1.jpg", second: "images/img2.jpg", third:"images/img3.jpg"};
    var titles = ["BIG HERO 6","Mockingjay","Horrible Bosses"];
    createPNG(sources, titles);


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

function createPNG(sources, titles) {

    $(".share").click( function() {
        var expand = $(this).find('.expand');
        if( expand.css('z-index') == '-1') {
            $(this).find('.expand').css({'transform':'scale(100)','z-index':'1'});
        } else {
            $(this).find('.expand').css({'transform':'scale(0)','z-index':'-1'});
        }
    });

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    ctx.font="20px Futura";
    ctx.fillStyle="white";

    var pad = 5;
    var pad2 = pad*2;
    var ch = canvas.height;
    var cw = canvas.width;


    loadImages(sources, function(images) {

        //First
        ctx.drawImage(images.first, 0, 0, cw, images.first.height, pad, pad, cw*(3/5)-pad, ch-pad2);
        ctx.fillText(titles[0],cw/6,ch-pad*5);
        
        ctx.fillStyle="#E74C3C";
        ctx.moveTo(cw*(3/5),ch-pad);
        ctx.lineTo(cw*(3/5),ch-pad*13);
        ctx.lineTo(cw*(3/5)-pad*12,ch-pad);
        ctx.fill();

        //Second
        ctx.drawImage(images.second, 0, 0, images.second.width, images.second.height, cw*(3/5)+pad, pad, cw*(3/5)-120, ch*(3/5)-pad);
        ctx.fillStyle="white";
        ctx.fillText(titles[1],cw*(4/6),ch*(3/5)-pad*5);
        
        ctx.fillStyle="#E67E22";
        ctx.beginPath();
        ctx.moveTo(cw-pad,ch*(3/5));
        ctx.lineTo(cw-pad,ch*(3/5)-12*pad);
        ctx.lineTo(cw-13*pad,ch*(3/5));
        ctx.fill();
        
        //Third
        ctx.drawImage(images.third, 0, 0, images.third.width, images.third.height, cw*(3/5)+pad, ch*(3/5)+pad, cw*(3/5)-120, ch*(2/5)-pad2);
        ctx.fillStyle="white";
        ctx.fillText(titles[2],cw*(4/6),ch-pad*5);
        
        ctx.fillStyle="#F1C40F";
        ctx.beginPath();
        ctx.moveTo(cw-pad,ch-pad);
        ctx.lineTo(cw-pad,ch-pad*12);
        ctx.lineTo(cw-pad*12,ch-pad);
        ctx.fill();

        //var finalImg = canvas.toDataURL("image/png");
    });
}

function createLanding() {

    $(".buynow").click( function() {
    });

    var firstMovie = { img:'images/img1.jpg',title:'Big Hero 6',url:'http://',rating:'5'};
    var secondMovie = { img:'images/img2.jpg',title:'Mockingjay',url:'http://',rating:'5'};
    var thirdMovie = { img:'images/img3.jpg',title:'Horrible Bosses',url:'http://',rating:'5'};

    var movies = [firstMovie,secondMovie,thirdMovie];
    
    var first = $("#first");
    var second = $("#second");
    var third = $("#third");

    var divs = [first,second,third];

    for(var i = 0; i < 3; i++) {
        $(divs[i]).css('background-image','url('+movies[i].img+')')
                .find('.title').html(movies[i].title);
        generateStars( $(divs[i]).find('.stars'), movies[i].rating );
    }
}

function generateStars(div,rating) {
    rating = parseInt(rating);
    for(var i = 1; i < rating; i++) {
        var img = document.createElement("img");
        img.src = 'images/star.png';

        div.append(img);
    }
}
