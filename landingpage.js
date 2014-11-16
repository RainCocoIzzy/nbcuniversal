function Movie(){
    this.title="";
    this.rating="";
    this.img="";
    this.imageObj= new Image();
    this.id="";
    this.url = ""
}
var movies = [null,null,null];

function createMovie(num,title,rating,photo,id){
    if(photo=="http://images.fandango.com/r94.9/ImageRenderer/750/500/nox.jpg/2148/images/masterrepository/fandango/2148/billye2.jpg"){
        return;
    }
    var movie = new Movie();
    movie.title=title;
    movie.rating = rating;
    movie.img = photo;
    movie.id=id;
    movie.imageObj.src = photo;
    movies[num-1]=movie;
        console.log(photo + " "+num);
    // guessing at making the url
    var url = movie.title.split(",").join("");
    url = url.split(" ").join("");
    url = url.toLowerCase();
    url = "http://www.fandango.com/"+url+"_"+id+"/movieoverview";
    movie.url=url;
    if(movies[0]!=null && movies[1]!=null && movies[2]!=null){
        createLanding();
    }

}


function createLanding() {

    var first = $("#first");
    var second = $("#second");
    var third = $("#third");
    first.addClass("first"); 
    second.addClass("second secondDelay"); 
    third.addClass("third thirdDelay"); 

    $("#firstbutton").click(function(){
        window.open(movies[0].url);
    });
    $("#secondbutton").click(function(){
        window.open(movies[1].url);
    });
    $("#thirdbutton").click(function(){
        window.open(movies[2].url);
    });

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
