<?php


$grace_id = $_GET['grace_id'];

include '../config.php';

$config = getConfig();

$dir_analysis = $config['dir_analysis'];
$link_web_analysis = $config['link_web_analysis'];

$dbh = new PDO('mysql:host='.$config['host'].';dbname='.$config['database'].';port='.$config['port'],$config['username'],$config['password']);

$results_dir = $dir_analysis."/GRAWITA/".$grace_id;

$image_array = array();

$agile_image_array = array();
foreach (glob($results_dir."/AGILE*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($agile_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["agile"]=$agile_image_array;

$grawita_image_array = array();
foreach (glob($results_dir."/GRAWITA*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($grawita_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["grawita"]=$grawita_image_array;


$intgral_image_array = array();
foreach (glob($results_dir."/INTEGRAL*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($intgral_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["integral"]=$intgral_image_array;

echo json_encode($image_array);

?>
