<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('upload_max_size', '64M');
ini_set('post_max_size', '64M');

include '../config.php';

$config = getConfig();

$root_dir_analysis = $config['dir_analysis'];

//check password

$mission_name = $_POST['mission_name'];
$password = $_POST['password'];
#$comments = $_POST['comments'];


$trigger_id = $_POST['trigger_id'];
$instrument_name = $_POST['instrument_name'];
$sequence_number = $_POST['sequence_number'];

if($mission_name=="AGILE" && $password!="agile" )
{
  echo "badpassword";
  exit();
}
if($mission_name=="INTEGRAL" && $password!="integral" )
{
  echo "badpassword";
  exit();
}
if($mission_name=="GRAWITA" && $password!="grawita" )
{
  echo "badpassword";
  exit();
}
if($mission_name=="FERMI" && $password!="fermi" )
{
  echo "badpassword";
  exit();
}

$dir_analysis = $root_dir_analysis."/".$instrument_name."/".$trigger_id."-".$sequence_number."/".$mission_name."/";

//echo $dir_analysis;

if(!file_exists ( $dir_analysis )){
  mkdir($dir_analysis, 0777, true);
}


$extension =  array('png','jpg',"jpeg");
$file_extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

if(!in_array($file_extension,$extension) ) {
    echo 'bad 1';
    exit();
}
else
{

  $uploadfile = $dir_analysis."/".$_FILES['file']['name'];
  //$comment_file = str_replace(array(".png",".jpg",".jpeg"),".txt",$uploadfile);

  //if(file_put_contents($comment_file,$comments)!=false){


  //}
  //else{
  //  	echo "bad 2";
  //    exit();
  //}
  
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {

		  chmod($uploadfile, 0664);

    	echo "good";
	} else {
    	echo "bad 3";
}
}
?>
