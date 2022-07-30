<?php


$trigger_id = $_GET['trigger_id'];
$instrument_name = $_GET['instrument_name'];
$seqnum = $_GET['seqnum'];


include '../config.php';

$config = getConfig();

$dir_analysis = $config['dir_analysis'];
$link_web_analysis = $config['link_web_analysis'];
$pipedir = $config['agilepipe_dir'];

$dbh = new PDO('mysql:host='.$config['host'].';dbname='.$config['database'].';port='.$config['port'],$config['username'],$config['password']);
$dbh->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);


$results_dir = $dir_analysis."/".$instrument_name."/".$trigger_id."-".$seqnum;

$image_array = array();
#print($results_dir."AGILE/AGILE");
#echo $results_dir."/AGILE_MCAL/AGILE_MCAL*.{jpg,jpeg,png}";
$agile_image_array = array();
foreach (glob($results_dir."/AGILE/*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {
    #print($filename);
    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($agile_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["agile"]=$agile_image_array;
#print($image_array["agile"]);

$grawita_image_array = array();
foreach (glob($results_dir."/GRAWITA*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($grawita_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["grawita"]=$grawita_image_array;


$intgral_image_array = array();
foreach (glob($results_dir."/INTEGRAL/INTEGRAL*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($intgral_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["integral"]=$intgral_image_array;

$fermi_image_array = array();
foreach (glob($results_dir."/FERMI*.{jpg,jpeg,png}",GLOB_BRACE) as $filename) {

    $comment_path = str_replace(array(".png",".jpg",".jpeg"),".txt",$filename);
    $comment = file_get_contents($comment_path);

    $image = str_replace($dir_analysis,$link_web_analysis,$filename);

    array_push($fermi_image_array,array("title"=>basename($filename),"image_path"=>$image,"comment"=>$comment));
}

$image_array["fermi"]=$fermi_image_array;

// get list of other events in +-10 seconds

// get the trigger time for the opened alert 
$trigger_time = -1;
if($instrument_name == "LIGO_TEST" || $instrument_name == "LIGO")
{   
 
    $query = "select time from receivedsciencealert rsa join instrument inst on (inst.instrumentid = rsa.instrumentid) join notice n on (n.receivedsciencealertid = rsa.receivedsciencealertid) where inst.name = :instrumentname and attributes->'$.grace_id' = :triggerid and seqnum = :seqnum";
    $sql = $dbh->prepare($query);
    $sql->bindParam(':instrumentname',$instrument_name);
    $sql->bindParam(':seqnum', $seqnum);
    $sql->bindParam(':triggerid', $trigger_id);

    $sql->execute();
    $result = $sql->fetchAll();
    
    
    foreach ($result as $row){
     
        $trigger_time = $row['time'];
    }

    if ( $trigger_time==-1){
        echo "error";
    }
   
} else{
    $query = "select time from receivedsciencealert rsa join instrument inst on (inst.instrumentid = rsa.instrumentid) join notice n on (n.receivedsciencealertid = rsa.receivedsciencealertid) where inst.name = :instrumentname and trigger_id = :triggerid and seqnum = :seqnum";
    $sql = $dbh->prepare($query);
    $sql->bindParam(':instrumentname',$instrument_name);
    $sql->bindParam(':seqnum', $seqnum);
    $sql->bindParam(':triggerid', $trigger_id);

    $sql->execute();
    $result = $sql->fetchAll();
    
    
    foreach ($result as $row){
        $trigger_time = $row['time'];
    }

    if ( $trigger_time==-1){
        echo "error";
    }
}

$other_notice_list_notice_list = array();

      $noinstrid = 219;
      
      #get notice in time window
      $query = "select ins.name,n.seqnum,n.noticetime,rsa.triggerid,rsa.time as 'trigger_time',ste,notice from notice n join receivedsciencealert rsa on ( rsa.receivedsciencealertid = n.receivedsciencealertid) join instrument ins on(ins.instrumentid = rsa.instrumentid) where  ins.name != :noticeintrname and rsa.instrumentid != :noinstrid and rsa.time > :triggertime1 and rsa.time < :triggertime2 and n.seqnum = (select max(seqnum) from notice n2 join receivedsciencealert rsa2 on ( rsa2.receivedsciencealertid = n2.receivedsciencealertid)  where  rsa.triggerid = rsa2.triggerid ) order by trigger_time ";
      $sql = $dbh->prepare($query);
      
      $trigger_time_1 = $trigger_time-10;
      $trigger_time_2 = $trigger_time+10;
      $sql->bindParam(':noinstrid', $noinstrid);
      $sql->bindParam(':triggertime1', $trigger_time_1);
      $sql->bindParam(':triggertime2', $trigger_time_2);
      $sql->bindParam(':noticeintrname',$instrument_name);
    
      $sql->execute();
      $result = $sql->fetchAll();
    
      
      foreach ($result as $row){
      
        
          $instr_name = $row['name'];
          $triggerid = $row['triggerid'];
          $seqnum = $row['seqnum'];
          $noticetime = $row['noticetime'];
          $trigger_time = $row['trigger_time'];
          $notice = $row['notice'];
          $mjd_time = $trigger_time/86400.0+53005.0;

          $attributes = json_decode($row['attributes'],true);
        
          if($notice == "Injected." || empty($attributes))
          {
            $grace_id = "";#$attributes['grace_id'];
            $bbh = "";
            $nsbh = "";
            $bns = "";#$attributes['bns'];
            $terrestrial = "";
            $far = "";
            $mass_gap = "";
            $has_ns = "";
            $has_remnant = "";
          }
          else
          {
            //$attributes = json_decode($row['attributes'],true);
            // $grace_id = $attributes['grace_id'];
            // $bbh = $attributes['bbh'];
            // $nsbh = $attributes['nsbh'];
            // $bns = $attributes['bns'];
            // $terrestrial = $attributes['terrestrial'];
            // $far = $attributes['far'];
            // $mass_gap = $attributes['mass_gap'];
            // $has_ns = $attributes['has_ns'];
            // $has_remnant = $attributes['has_remnant'];
            $grace_id = $attributes['grace_id'];
            $bbh = $attributes['bbh'];
            $nsbh = $attributes['nsbh'];
            $bns = $attributes['bns'];
            $terrestrial = $attributes['terrestrial'];
            $far = $attributes['far'];
            $mass_gap = $attributes['mass_gap'];
            $has_ns = $attributes['has_ns'];
            $has_remnant = $attributes['has_remnant'];
          }

          $timeutc = array();
          exec($pipedir.'/visCheck/getdate mjd2i '.$mjd_time, $timeutc);



          array_push($other_notice_list_notice_list,array('trigger_time_utc'=>$timeutc[0],'trigger_time'=>$trigger_time,'noticetime'=>$noticetime,'instr_name'=>$instr_name,'triggerid'=>$triggerid,'seqnum'=>$seqnum,'grace_id'=>$grace_id));
      }
    


echo json_encode(array('image_array'=>$image_array,'other_notice_list'=>$other_notice_list_notice_list));

?>
