
<html>
    <head>
        <title></title>
        <link href="index.css" rel="stylesheet"/>
        <script src="jquery.min.js"></script>
        <script src="landingpage.js"/></script>
    </head>
    <script>
    var m1 = "<? echo $_GET['m1'];?>";
    var m2 = "<? echo $_GET['m2'];?>";
    var m3 = "<? echo $_GET['m3'];?>";

    var xmlhttp=new XMLHttpRequest();
    xmlDoc=xmlhttp.responseXML;
    xmlhttp.onreadystatechange=function() {
    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
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
    <body style="margin:0; overflow:hidden; background:black">
        <div class="placeholder" id="first">
            <div class="bottomsection">
                <div class="title"></div>
                <div class="stars"></div>
                <div class="buynow btn" id="firstbutton">
                    <img src="images/ticket.png"/>
                    <div class="buytext">Buy Tickets</div>
                </div>
            </div>
        </div>
        <div class="placeholder placeholder2" id="second">
            <div class="bottomsection">
                <div class="title"></div>
                <div class="stars"></div>
                <div class="buynow btn" id="secondbutton">
                    <img src="images/ticket.png"/>
                    <div class="buytext">Buy Tickets</div>
                </div>
            </div>
        </div>
        <div class="placeholder placeholder3" id="third">
            <div class="bottomsection">
                <div class="title"></div>
                <div class="stars"></div>
                <div class="buynow btn" id="thirdbutton">
                    <img src="images/ticket.png"/></a>
                    <div class="buytext">Buy Tickets</div>
                </div>
            </div>
        </div>
        </div>
        <div onclick="window.location='./testdrag.html'" id="headerbar">
            Pick your top 3!
        </div>
    </body>
</html>
