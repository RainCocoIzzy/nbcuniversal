<?
$locpos = $_GET['loc'];
$url = $_GET['url'];

$loc = $_SERVER['DOCUMENT_ROOT']."/nbcuniversal/lib/image".$locpos.".png";
file_put_contents($loc, file_get_contents($url));
echo $loc;
?>
