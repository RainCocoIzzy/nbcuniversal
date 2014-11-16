<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="description" content="">
        <meta name="author" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title></title>
        <link href="index.css" rel="stylesheet"/>
    </head>
    <body id="index" style="margin:0; overflow:hidden">
    <div id="fb-root"></div>
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '717277388349929',
      xfbml      : true,
      version    : 'v2.2'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>

        <div class="container" id="postlist">
            <div class="share" id="facebooklink">
                <div class="expand"></div>
                <img class="icon" src="images/facebook.png"/>
            </div>
            <div class="share" id="twitterlink">
                <div class="expand"></div>
                <img class="icon" src="images/twitter.png"/>
            </div>
            <div class="share" id="googlelink">
                <div class="expand"></div>
                <img class="icon" src="images/google.png"/>
            </div>
            <div class="share" id="instagramlink">
                <div class="expand"></div>
                <img class="icon" src="images/instagram.png"/>
            </div>
            <div class="share" id="postlink">
                <div class="expand"></div>
            </div>
            <canvas style="" id="canvas" width="583px" height="306px"></canvas>
        </div>
        <script src="jquery.min.js"></script>
        <script src="index.js"></script>
    <script>
        var m1 = "<? echo $_GET['m1'];?>";
        var m2 = "<? echo $_GET['m2'];?>";
        var m3 = "<? echo $_GET['m3'];?>";

        var xmlhttp=new XMLHttpRequest();
        xmlDoc=xmlhttp.responseXML;
        xmlhttp.onreadystatechange=function() {
            if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                console.log("1");
            var response =xmlhttp.responseText;
            var parse = $.parseXML(response);
            var $xml = $(parse);
            var movies = $xml.find('moviesbypostalcodesearchresponse').find('data').find('movies').get(0);
            var k =0;
            var num = $(movies).attr('itemcount');
            for(var i =0;i<num;i++){
                var data = $(movies).children().eq(i).get(0);
                var id = $(data).attr('id');
                var photos = data['photos'];

                var title="";
                var genre="";
                var synopsis="";
                var rating="";
                var photo="";
                for(var j =0;j<$(data).children().length;j++){
                    var d2 = $(data).children().eq(j).get(0);
                    var n = d2.nodeName;
                    if(n=='title'){
                        title = $(d2).text();
                    } else if(n=='fanrating'){
                        rating = $(d2).children().eq(0).text();
                    } else if(n=='photos'){
                        var photos = d2;
                        photo = $(photos).children().eq(0).attr('imagehref');
                    }
                }
                if(title!="" && rating!="" && photo!="" && id!="" && (id==m1 || id==m2 || id==m3)){
                    if(id==m1){
                        createMovie(1,title,rating,photo,id);
                    } else if(id==m2){
                        createMovie(2,title,rating,photo,id);
                    } else {
                        createMovie(3,title,rating,photo,id);
                    }
                }
            }
        }
    }
    xmlhttp.open("GET","test.php",true);
xmlhttp.send();
    </script>
    </body>
</html>
