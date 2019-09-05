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

print($mission_name."\n");
print($password."\n");

if($mission_name=="AGILE" && $password!="a" )
{
  echo "bad";
  exit();
}
if($mission_name=="INTEGRAL" && $password!="integralu" )
{
  echo "bad";
  exit();
}
if($mission_name=="GRAWITA" && $password!="grawitau" )
{
  echo "bad";
  exit();
}
if($mission_name=="FERMI" && $password!="fermiu" )
{
  echo "bad";
  exit();
}

$dir_analysis = $config['dir_analysis']."//GRAWITA//".$_POST['grace_id']."/";

if(!file_exists ( $dir_analysis )){
  mkdir($dir_analysis);
}


$extension =  array('png','jpg',"jpeg");
$file_extension = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
print($file_extension."\n");
if(!in_array($file_extension,$extension) ) {
    echo 'bad';
}
else
{

  $uploadfile = $dir_analysis."/".$mission_name."_".$_FILES['file']['name'];
  $comment_file = str_replace(array(".png",".jpg",".jpeg"),".txt",$uploadfile);
  print($comments."\n");
  print($comment_file."\n");

  if(file_put_contents($comment_file,$comments)!=false){


  }
  else{
    	echo "bad";
  }

	if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {

		  chmod($uploadfile, 0664);

    	echo $uploadfile;
	} else {
    	echo "bad";
}
}
?>
