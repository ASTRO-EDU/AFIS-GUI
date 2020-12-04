<?php


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ini_set('upload_max_size', '64M');
ini_set('post_max_size', '64M');

include '../config.php';

$config = getConfig();

//check password

$mission_name = $_POST['mission_name'];
$password = $_POST['password'];
$comments = $_POST['comments'];


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

$dir_analysis = $config['dir_analysis']."/".$_POST['grace_id']."/";

if(!file_exists ( $dir_analysis )){
  mkdir($dir_analysis);
}


$extension =  array('png','jpg',"jpeg");
$file_extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);

if(!in_array($file_extension,$extension) ) {
    echo 'bad';
    exit();
}
else
{

  $uploadfile = $dir_analysis."/".$mission_name."_".$_FILES['file']['name'];
  $comment_file = str_replace(array(".png",".jpg",".jpeg"),".txt",$uploadfile);

  if(file_put_contents($comment_file,$comments)!=false){


  }
  else{
    	echo "bad";
      exit();
  }
  
	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {

		  chmod($uploadfile, 0664);

    	echo "good";
	} else {
    	echo "bad";
}
}
?>
