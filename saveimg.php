<?
if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{
// Get the data
$data=$GLOBALS['HTTP_RAW_POST_DATA'];
$filteredData=substr($data, strpos($data, ",")+1);
$data = base64_decode($filteredData);

$locpos = $_GET['loc'];

$im = imagecreatefromstring($data);
if ($im !== false) {
    //header('Content-Type: image/png');
    //imagepng($im);
    //imagedestroy($im);
    echo 'yes';
    $loc = $_SERVER['DOCUMENT_ROOT']."/dragdrop/created/image".$locpos.".png";
    imagepng($im, $loc);
    echo $loc;
}
else {
    echo 'An error occurred.';
}
}
?>
