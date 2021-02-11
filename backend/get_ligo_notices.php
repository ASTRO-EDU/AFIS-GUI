<?php

  # ==========================================================================
  #
  #
  # Copyright (C) 2018 INAF - OAS Bologna
  # Author: Nicolo' Parmiggiani <nicolo.parmiggiani@inaf.com>
  #
  # This program is free software: you can redistribute it and/or modify
  # it under the terms of the GNU General Public License as published by
  # the Free Software Foundation, either version 3 of the License, or
  # (at your option) any later version.
  #
  # This program is distributed in the hope that it will be useful,
  # but WITHOUT ANY WARRANTY; without even the implied warranty of
  # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  # GNU General Public License for more details.
  #
  # You should have received a copy of the GNU General Public License
  # along with this program.  If not, see <http://www.gnu.org/licenses/>.
  #
  # ==========================================================================

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    include '../config.php';

    $config = getConfig();

    $pipedir = $config['agilepipe_dir'];

    $instrument_name = $_GET['instrument_name'];

    $dbh = new PDO('mysql:host='.$config['host'].';dbname='.$config['database'].';port='.$config['port'],$config['username'],$config['password']);
    $instrument_query = "";

    if($instrument_name!="all")
    {
      $instrument_query = "where i.name = '".$instrument_name."'";
    }
    else{
      $instrument_query  = "where i.instrumentid!=19 ";
    }

    # get array of job queued in jt.partition large t_submit
    $alert_list = array();

    $query = "select name,time,noticetime,triggerid,seqnum,notice,JSON_PRETTY(n.attributes) as 'attributes' from receivedsciencealert rsa join instrument i on(i.instrumentid = rsa.instrumentid) join  notice n on (n.receivedsciencealertid = rsa.receivedsciencealertid)  where i.name != 'LIGO_TEST'  and noticetime > '2019-06-01' and n.seqnum in (select max(seqnum) from notice join receivedsciencealert rsalert on (rsalert.receivedsciencealertid = notice.receivedsciencealertid ) where triggerid = rsa.triggerid) order by triggerid desc";


    foreach ($dbh->query($query) as $row)
    {
        $intr_name = $row['name'];
        $trigger_time = $row['time'];
        $notice_time = $row['noticetime'];
        $triggerid = $row['triggerid'];
        $seqnum = $row['seqnum'];
        $notice = $row["notice"];
        
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


        $link_results = "../analysis/grawita/LIGO-alert/".$grace_id;

        $mjd_time = $trigger_time/86400.0+53005.0;
        $timeutc = array();
        exec($pipedir.'/visCheck/getdate mjd2i '.$mjd_time, $timeutc);
        $trigger_time_utc = $timeutc[0];

        array_push($alert_list,array("intr_name"=>$intr_name,'has_remnant'=>$has_remnant,'has_ns'=>$has_ns,'mass_gap'=>$mass_gap,'far'=>$far,'terrestrial'=>$terrestrial,'bns'=>$bns,'nsbh'=>$nsbh,'bbh'=>$bbh,'grace_id'=>$grace_id,'trigger_time_utc'=>$trigger_time_utc,'link_results'=>$link_results,'trigger_time'=>$trigger_time,'notice_time'=>$notice_time,'triggerid'=>$triggerid,'seqnum'=>$seqnum));
    }

    $response = array("alert_list"=>$alert_list);

    echo json_encode($response);

 ?>
