// Copyright (c) 2019, AGILE team
// Authors: Nicolo' Parmiggiani <nicolo.parmiggiani@gmail.com>,
//
// Any information contained in this software is property of the AGILE TEAM
// and is strictly private and confidential. All rights reserved.


var current_contact_global = ""
var mcal_cor_arrived = 0
var grid_evt_arrived = 0
var current_contact_time_utc = ""

function get_event_report(){
  $.ajax({
    cache: false,
    url:'backend/get_eventreport.php',
    type:'get',
    data: {},
    contentType: "application/json; charset=utf-8",
    async: false

  }).done(function (data) {

    //console.log(data)
    document.getElementById("evt_report").innerHTML=data

  }).fail(function (jqXHR, textStatus) {
    console.log("error");
    console.log(textStatus);
  });

}

function get_last_alert(){

  $.ajax({
    cache: false,
    url:'backend/get_last_alert.php',
    //url:'backend/test.py',
    type:'get',
    data: {},
    contentType: "application/json; charset=utf-8",
    async: false

  }).done(function (data) {

      console.log("last alert")
      console.log(data)
      data_json = JSON.parse(data);

      last_notice = data_json.last_notice
      other_notice_list = data_json.other_notice_list

      document.getElementById("alert_title").innerHTML = "Alert: "+last_notice.instr_name+" - UTC: "+last_notice.trigger_time_utc.replace("T"," ")+" ";

      document.getElementById("visibility_alert_link").href = last_notice.visibility_path;
      document.getElementById("visibility_alert_img").src = last_notice.visibility_path;

      document.getElementById("agile_pisition_link").href = "./img/position_agile.png";
      document.getElementById("agile_pisition_img").src = "./img/position_agile.png";

      document.getElementById("agile_cts_link").href = last_notice.cts_10
      document.getElementById("agile_cts_img").src = last_notice.cts_10

      document.getElementById("agile_mcal_link").href = last_notice.mcal_10
      document.getElementById("agile_mcal_img").src = last_notice.mcal_10

      document.getElementById("agile_exp_link").href = last_notice.exp_10
      document.getElementById("agile_exp_img").src = last_notice.exp_10

      document.getElementById("visibility_fov_link").href = last_notice.visibility_fov;
      document.getElementById("visibility_fov_img").src = last_notice.visibility_fov;

      document.getElementById("inter_position_link").href = "./img/position_satellites.png";
      document.getElementById("inter_position_img").src = "./img/position_satellites.png";

      document.getElementById("inter_error_regions_link").href = "./img/inter_error_region.png";
      document.getElementById("inter_error_regions_img").src ="./img/inter_error_region.png";


      var dataSet = new Array();
      var trigger_time_tt = last_notice.trigger_time;
      var trigger_time_utc = last_notice.trigger_time_utc;
      var instr_name = last_notice.instr_name;
      var notice_time = last_notice.noticetime;
      var triggerid = last_notice.triggerid;
      var seqnum = last_notice.seqnum;
      var link_run = last_notice.link_run;
      var link_results = last_notice.link_results;

      dataSet[0] = new Array();

      for (var j = 0; j <=6; j++) {


        if(j==0)
        {
          dataSet[0][j] =instr_name;
        }
        if(j==1)
        {
          dataSet[0][j] =trigger_time_tt;
        }
        if(j==2)
        {
          dataSet[0][j] =trigger_time_utc;
        }
        if(j==3)
        {
          dataSet[0][j] =notice_time;
        }
        if(j==4)
        {
          dataSet[0][j] =triggerid;
        }
        if(j==5){
          dataSet[0][j] =seqnum;
        }
        if(j==6){

          link_prompt = "prompt_results.html?instrumentname="+instr_name+"&triggerid="+triggerid+"&seqnum="+seqnum+"&triggertime="+trigger_time_tt;
          link_full = "full_results.html?instrumentname="+instr_name+"&triggerid="+triggerid+"&seqnum="+seqnum+"&triggertime="+trigger_time_tt;

          dataSet[0][j] = '<button type="submit"  onclick="window.open(\''+link_prompt+'\'); return false;" 	class="btn btn-success" >Prompt Analysis</button><br>';
          dataSet[0][j] += '<button type="submit" style="margin-top:10px;" onclick="window.open(\''+link_full+'\'); return false;" 	class="btn btn-success" >Full Analysis</button><br>';
        }
      }
      if ( $.fn.dataTable.isDataTable('#ligo-table') ) // se la tabella esiste già
      {
        var table = new $.fn.dataTable.Api('#ligo-table').clear();
        table.rows.add(dataSet).draw();
      }
      else
      {
        var table = $('#ligo-table').DataTable( {
          //"autoWidth": true,
          "lengthChange": false,
          "searching": false,
          "paging": false,
          "ordering": false,
          "info": false,
          columns: [

            { title: "Instrument Name" },
            { title: "trigger time (TT)" },
            { title: "trigger time (UTC)" },
            { title: "notice time (UTC)" },
            { title: "trigger id" },
            { title: "seqnum" },
            { title: "links" },

          ]
        } );
        table.rows.add(dataSet).draw();
      }

      //se non ho allerte sovrapposte temporalmente non mostro la mappa contour
      if(other_notice_list.length > 0)
      {
        //document.getElementById("inter_error_regions_div").style.display="block"
        //document.getElementById("inter_position_div").style.display="block"
        document.getElementById("inter_title").innerHTML = "<font color='black'>Notices in &plusmn 10s </font>"
        document.getElementById("other_table_div").style.display="block"

      }
      else{
        document.getElementById("other_table_div").style.display="block"
        document.getElementById("inter_title").innerHTML = "<font color='red'>No other Notices in &plusmn 10s </font>"
      }

      var dataSet = new Array();

      for (var i = 0; i < other_notice_list.length; i++) {

        var notice = other_notice_list[i]
        var trigger_time_utc = notice.trigger_time_utc;
        var trigger_time_tt = notice.trigger_time;
        var instr_name = notice.instr_name;
        var notice_time = notice.noticetime;
        var triggerid = notice.triggerid;
        var seqnum = notice.seqnum;
        var link_run = notice.link_run;
        var link_results = notice.link_results;

        dataSet[i] = new Array();

        for (var j = 0; j <=6; j++) {


          if(j==0)
          {
            dataSet[i][j] =instr_name;
          }
          if(j==1)
          {
            dataSet[i][j] =trigger_time_tt;
          }
          if(j==2)
          {
            dataSet[i][j] =trigger_time_utc;
          }
          if(j==3)
          {
            dataSet[i][j] =notice_time;
          }
          if(j==4)
          {
            dataSet[i][j] =triggerid;
          }
          if(j==5){
            dataSet[i][j] =seqnum;
          }
          if(j==6){

            link_prompt = "prompt_results.html?instrumentname="+instr_name+"&triggerid="+triggerid+"&seqnum="+seqnum+"&triggertime="+trigger_time_tt;
            link_full = "full_results.html?instrumentname="+instr_name+"&triggerid="+triggerid+"&seqnum="+seqnum+"&triggertime="+trigger_time_tt;

            dataSet[i][j] = '<button type="submit"  onclick="window.open(\''+link_prompt+'\'); return false;" 	class="btn btn-success" >Prompt Analysis</button><br>';
            dataSet[i][j] += '<button type="submit" style="margin-top:10px;" onclick="window.open(\''+link_full+'\'); return false;" 	class="btn btn-success" >Full Analysis</button><br>';
          }
        }
      }
      if ( $.fn.dataTable.isDataTable('#other-table') ) // se la tabella esiste già
      {
        var table = new $.fn.dataTable.Api('#other-table').clear();
        table.rows.add(dataSet).draw();
      }
      else
      {
        var table = $('#other-table').DataTable( {
          //"autoWidth": true,
          "lengthChange": false,
          "searching": false,
          "paging": false,
          "ordering": false,
          "info": false,
          columns: [

            { title: "Instrument Name" },
            { title: "trigger time (TT)" },
            { title: "trigger time (UTC)" },
            { title: "notice time (UTC)" },
            { title: "trigger id" },
            { title: "seqnum" },
            { title: "links" },

          ]
        } );
        table.rows.add(dataSet).draw();
      }

  }).fail(function (jqXHR, textStatus) {
    console.log("error");
    console.log(textStatus);
  });

}

function load_next_contact(currdate){

  $.ajax({
    cache: false,
    url:'backend/get_next_contact.php',
    //url:'backend/test.py',
    type:'get',
    data: {'datetime_now':currdate},
    contentType: "application/json; charset=utf-8",
    async: false

  }).done(function (data) {

      console.log("next")
      console.log(data)
      data_json = JSON.parse(data);
      var next_contact = data_json.next_contact
      var payload_conf = data_json.payload_conf
      var orbit_list = data_json.orbit_list
      var previous_contact = data_json.previous_contact

      var diff = Math.abs(new Date(currdate.replace(/-/g,"/").replace(/T/g," ")) - new Date(next_contact.orbit_acq_utc.replace(/-/g,"/")));
      var time_to_contact = Math.round((diff/1000/60));
      //console.log(time_to_contact)

      //console.log(next_contact.orbit_acq_utc)

      next_contact_local = new Date(next_contact.orbit_acq_utc.replace(/-/g,"/"))
      var d1 = new Date (),
      grid_bologna = new Date ( next_contact.orbit_acq_utc.replace(/-/g,"/") );
      grid_bologna.setMinutes ( next_contact_local.getMinutes() + 30 );

      mcal_bologna = new Date ( next_contact.orbit_acq_utc.replace(/-/g,"/") );
      mcal_bologna.setMinutes ( next_contact_local.getMinutes() + 25 );

      var grid_bologna = grid_bologna.getFullYear()+"-"+('0' + (grid_bologna.getMonth()+1)).slice(-2)+"-"+grid_bologna.getDate()+" "+grid_bologna.toLocaleTimeString();
      var grid_bologna = grid_bologna.split(".")[0].replace("T"," ");
      var mcal_bologna = mcal_bologna.getFullYear()+"-"+('0' + (mcal_bologna.getMonth()+1)).slice(-2)+"-"+mcal_bologna.getDate()+" "+mcal_bologna.toLocaleTimeString();
      var mcal_bologna = mcal_bologna.split(".")[0].replace("T"," ");

      document.getElementById("next_contact").innerHTML="Contact Number = "+next_contact.orbit_number
      document.getElementById("next_configuration").innerHTML="Configuration = "+payload_conf
      document.getElementById("next_time_for_contact").innerHTML="Time For Contact = "+time_to_contact+" minutes"
      document.getElementById("next_contact_start").innerHTML="Start: "+previous_contact.orbit_acq_utc+" (UTC)"
      document.getElementById("next_contact_stop").innerHTML="Stop: "+next_contact.orbit_acq_utc+" (UTC)"
      document.getElementById("bologna_grid_contact").innerHTML="MCAL @ Bologna = "+mcal_bologna+" (UTC)"
      document.getElementById("bologna_mcal_contact").innerHTML="GRID @ Bologna = "+grid_bologna+" (UTC)"


      // check for next data arrive, from Rome or from next contact
      var mcal_next_data_arrive = ""
      if(mcal_cor_arrived == 0){

        curr_date = new Date ( current_contact_time_utc.replace(/-/g,"/") );
        curr_date.setMinutes ( curr_date.getMinutes() + 25 );
        mcal_next_data_arrive = curr_date.getFullYear()+"-"+('0' + (curr_date.getMonth()+1)).slice(-2)+"-"+curr_date.getDate()+" "+curr_date.toLocaleTimeString();
        mcal_next_data_arrive = mcal_next_data_arrive.split(".")[0].replace("T"," ");
      }else{
        mcal_next_data_arrive = mcal_bologna
      }

      var grid_next_data_arrive = ""
      if(grid_evt_arrived == 0){
        curr_date = new Date ( current_contact_time_utc.replace(/-/g,"/") );
        curr_date.setMinutes ( curr_date.getMinutes() + 30 );
        grid_next_data_arrive = curr_date.getFullYear()+"-"+('0' + (curr_date.getMonth()+1)).slice(-2)+"-"+curr_date.getDate()+" "+curr_date.toLocaleTimeString();
        grid_next_data_arrive = grid_next_data_arrive.split(".")[0].replace("T"," ");
      }else{
        grid_next_data_arrive = grid_bologna
      }

      document.getElementById("mcal_next_data").innerHTML="Next MCAL @BO = "+mcal_next_data_arrive+ " UTC"
      document.getElementById("grid_next_data").innerHTML="Next GRID @BO = "+grid_next_data_arrive+" UTC"


      var dataSet = new Array();

      for(var i = 0 ; i<orbit_list.length ; i++){

        var orbit_acq_utc,orbit_number,id_orbit,orbit_status,configuration;
        orbit_acq_utc = orbit_list[i].orbit_acq_utc;
        orbit_number = orbit_list[i].orbit_number;
        orbit_status = orbit_list[i].orbit_status;
        configuration = orbit_list[i].orbit_conf;

        // add table data
        dataSet[i] = new Array();
        for (var j = 0; j <=8; j++) {
          if(j==0){
            dataSet[i][j] = orbit_acq_utc;
          }
          if(j==1){
            dataSet[i][j] = orbit_number;
          }
          if(j==2){
            dataSet[i][j] = orbit_status;
          }
          if(j==3) {
            dataSet[i][j] = configuration;
          }
        }
      }
      if ( $.fn.dataTable.isDataTable( '#orbit-list-table') ) // se la tabella esiste già
      {
        var table = new $.fn.dataTable.Api( '#orbit-list-table' ).clear();
        table.rows.add(dataSet).draw();
      }
      else
      {
        console.log("create table");
        var table = $('#orbit-list-table').DataTable( {
          //  responsive:true,
          "lengthChange": false,
          "searching": false,
          "paging": false,
          "ordering": false,
          "info": false,
          //"order": [[ 0, "desc" ]],
          columns: [
            { title:"Contact Time (UTC)"},
            { title:"Orbit Number"},
            { title:"Scheduled"},
            { title:"Conf"}
          ],
          rowCallback: function(row, data, index){
            //console.log(data)
            if(data[2]=='Yes'){
              $(row).css('background','rgba(0, 255, 0 ,0.25)');
            }
            if(data[2]=='Not'){
              $(row).css('background','rgba(255,0 , 0 ,0.25)');
            }
            console.log(data[1]+" "+current_contact_global)
            if(data[1]==current_contact_global){
              $(row).find('td:eq(1)').css('font-weight', 'bold');
            }
          }
        } );
        table.rows.add(dataSet).draw();
      }


  }).fail(function (jqXHR, textStatus) {
    console.log("error");
    console.log(textStatus);
  });

}

function load_current_contact(currdate) {
  $.ajax({
    cache: false,
    url:'backend/get_current_contact.php',
    //url:'backend/test.py',
    type:'get',
    data: {'datetime_now':currdate},
    contentType: "application/json; charset=utf-8",
    async: false

  }).done(function (data) {

    console.log("current")
    console.log(data)
    data_json = JSON.parse(data);
    var current_contact = data_json.orbit_list
    var cor_3916_exist = data_json.cor_3916_exist
    var cor_3913_exist = data_json.cor_3913_exist
    var cor_3201_exist = data_json.cor_3201_exist
    var cor_3908_exist = data_json.cor_3908_exist
    var cor_3905_exist = data_json.cor_3905_exist
    var log_exist = data_json.log_exist
    var evt_exist = data_json.evt_exist

    if(cor_3916_exist == 1)
      mcal_cor_arrived = 1
    if(evt_exist == 1)
      grid_evt_arrived = 1

    var payload_conf = data_json.payload_conf
    var utc_current_contact_start = data_json.utc_current_contact_start
    console.log(utc_current_contact_start)
    var utc_current_contact_stop = data_json.utc_current_contact_stop
    console.log(utc_current_contact_stop)
    var mcal_orbit_list = data_json.mcal_orbit_list
    //console.log(current_contact)
    //  console.log(payload_conf)

    current_contact_time_utc = utc_current_contact_stop

    // UPDATE GRID SPOT6 TIME

    document.getElementById("label_spot6_1").innerHTML="GRID/SPOT6 1d: "+data_json.spot6_1d_start+" - "+data_json.spot6_1d_stop
    document.getElementById("label_spot6_2").innerHTML="GRID/SPOT6 2d: "+data_json.spot6_2d_start+" - "+data_json.spot6_2d_stop

    var diff = Math.abs(new Date(utc_current_contact_start.replace(/-/g,"/")) - new Date(utc_current_contact_stop.replace(/-/g,"/")));
    var minutes = Math.round((diff/1000/60));
    console.log(minutes)

    var minutes_from_start_millisecond = Math.abs(new Date(currdate.replace(/T/g," ").replace(/-/g,"/")) - new Date(utc_current_contact_stop.replace(/-/g,"/")));
    var minutes_from_start = Math.round((minutes_from_start_millisecond/1000/60));
    console.log(minutes_from_start)

    //console.log(next_contact.orbit_acq_utc)
    console.log("data"+current_contact.orbit_acq_utc.replace(/-/g,"/"))
    utc_current_contact_timestamp = new Date(current_contact.orbit_acq_utc.replace(/-/g,"/")).getTime()

    var evt_bologna = 30-minutes_from_start
    var log_bologna = 25-minutes_from_start
    var mcal_bologna = 20-minutes_from_start
    current_contact_global = current_contact.orbit_number

    document.getElementById("current_contact").innerHTML="Last Contact Number = "+current_contact.orbit_number
    document.getElementById("current_configuration").innerHTML="Configuration = "+payload_conf
    document.getElementById("time_from_current_contact").innerHTML="Minutes Since Contact = "+minutes_from_start
    document.getElementById("current_contact_start").innerHTML="Contact Start: "+utc_current_contact_start+" (UTC)"
    document.getElementById("current_contact_stop").innerHTML="Contact Stop: "+utc_current_contact_stop+" (UTC)"

    document.getElementById("archived_contact").innerHTML="Archived Contact Number: "+data_json.previous_contact.orbit_number
    document.getElementById("grid_stop").innerHTML="GRID Stop: "+data_json.last_evt_tstop_utc+" (UTC)"


    document.getElementById("cor_3908_stop_data").innerHTML="MCAL-3908 -- "+data_json.last_3908_tstop_utc+" (UTC) "+data_json.last_3908_tstop
    document.getElementById("cor_3913_stop_data").innerHTML="COR-3913 -- "+data_json.last_3913_tstop_utc+" -- "+data_json.last_3913_tstop
    document.getElementById("cor_3905_stop_data").innerHTML="SA-3905 -- "+data_json.last_3905_tstop_utc+" -- "+data_json.last_3905_tstop
    document.getElementById("cor_3916_stop_data").innerHTML="COR-3916 -- "+data_json.last_3916_tstop_utc+" -- "+data_json.last_3916_tstop
    document.getElementById("cor_3201_stop_data").innerHTML="COR-3201 -- "+data_json.last_3201_tstop_utc+" -- "+data_json.last_3201_tstop
    document.getElementById("evt_stop_data").innerHTML="GRID-EVT -- "+data_json.last_evt_tstop_utc+" -- "+data_json.last_evt_tstop
    document.getElementById("log_stop_data").innerHTML="LOG --   "+data_json.last_log_tstop_utc+" -- "+data_json.last_log_tstop

    document.getElementById("mcal_3908_preview").innerHTML="MCAL 3908 last trigger: "+data_json.last_3908_tstop_utc.replace("T"," ")
    document.getElementById("mcal_3916_preview").innerHTML="COR 3916 (coverage): "+data_json.last_3916_tstop_utc.replace("T"," ")
    document.getElementById("log_preview").innerHTML="LOG: "+data_json.last_log_tstop_utc.replace("T"," ")
    document.getElementById("evt_preview").innerHTML="EVT: "+data_json.last_evt_tstop_utc.replace("T"," ")


    if (mcal_bologna<0)
      mcal_bologna = "<font color='red'>"+mcal_bologna+"</font>"
    if (log_bologna<0)
      log_bologna = "<font color='red'>"+log_bologna+"</font>"
    if (evt_bologna<0)
      evt_bologna = "<font color='red'>"+evt_bologna+"</font>"
    if(cor_3913_exist==1)
      document.getElementById("current_contact_bologna_cor_3913").innerHTML="COR(3913) @ BO  = <font color='green'>Arrived</font>"
    else
      document.getElementById("current_contact_bologna_cor_3913").innerHTML="COR(3913) @ BO = "+mcal_bologna+" minutes"
    if(cor_3905_exist==1)
      document.getElementById("current_contact_bologna_cor_3905").innerHTML="SA(3905) @ BO  = <font color='green'>Arrived</font>"
    else
      document.getElementById("current_contact_bologna_cor_3905").innerHTML="SA(3905) @ BO = "+mcal_bologna+" minutes"
    if(cor_3916_exist==1)
      document.getElementById("current_contact_bologna_cor_3916").innerHTML="COR(3916) @ BO  = <font color='green'>Arrived</font>"
    else
      document.getElementById("current_contact_bologna_cor_3916").innerHTML="COR(3916) @ BO = "+mcal_bologna+" minutes"
    if(cor_3908_exist==1)
      document.getElementById("current_contact_bologna_cor_3908").innerHTML="MCAL(3908) @ BO  = <font color='green'>Arrived</font>"
    else
      document.getElementById("current_contact_bologna_cor_3908").innerHTML="MCAL(3908) @ BO = "+mcal_bologna+" minutes"

    if(cor_3201_exist==1)
      document.getElementById("current_contact_bologna_cor_3201").innerHTML="COR(3201) @ BO  = <font color='green'>Arrived</font>"
    else
      document.getElementById("current_contact_bologna_cor_3201").innerHTML="COR(3201) @ BO = "+mcal_bologna+" minutes"


    if(evt_exist==1){
      document.getElementById("grid_analysis1d").style.display="block"
      document.getElementById("grid_analysis2d").style.display="block"
      document.getElementById("current_contact_bologna_evt").innerHTML="EVT @ BO = <font color='green'>Arrived</font>"
    }
    else{
      document.getElementById("grid_title").innerHTML="<font color='red'>GRID data not arrived yet</font>"
      document.getElementById("current_contact_bologna_evt").innerHTML="EVT @ BO = "+evt_bologna+" minutes"
    }
    if(log_exist==1){
      document.getElementById("current_contact_bologna_log").innerHTML="LOG @ BO = <font color='green'>Arrived</font>"
    }
    else{
      document.getElementById("current_contact_bologna_log").innerHTML="LOG @ BO = "+log_bologna+" minutes"
    }




    var dataSet = new Array();
    var mcal_current_contact_analyzed = false;
    //if(mcal_orbit_list[0].orbit_number.endsWith(current_contact.orbit_number)){
    if(mcal_orbit_list[0].orbit_number.indexOf(current_contact.orbit_number) !== -1 )
    {
      console.log("MCAL finished")
      mcal_current_contact_analyzed = true
    }
    else{
      console.log("MCAL not finished")
      document.getElementById("mcal_analysis").innerHTML = "<font color='red'>MCAL analysis of current contact not finished yet</font>";
      //document.getElementById("mcal_orbit_col").style.display = "none"
    }

    for(var i = 0 ; i<mcal_orbit_list.length ; i++)
    {

      var web_dir,grb_like_number,id_orbit,trend,orbit_number,tgf_number,grb_number,ste_number,last_trigger,first_trigger,trigger_number;

      id_orbit = mcal_orbit_list[i].id_orbit;
      trend = mcal_orbit_list[i].trend;
      orbit_number = mcal_orbit_list[i].orbit_number;
      first_trigger = mcal_orbit_list[i].first_trigger;
      last_trigger = mcal_orbit_list[i].last_trigger;
      tgf_number = mcal_orbit_list[i].tgf_number;
      grb_number = mcal_orbit_list[i].grb_number;
      grb_like_number = mcal_orbit_list[i].grb_like_number;
      ste_number = mcal_orbit_list[i].ste_number;
      trigger_number = mcal_orbit_list[i].trigger_number;
      web_dir = mcal_orbit_list[i].web_dir;

      // add table data
      dataSet[i] = new Array();

      for (var j = 0; j <=8; j++) {

        if(j==0)
        {
          dataSet[i][j] = orbit_number;
        }
        if(j==1)
        {
          dataSet[i][j] = first_trigger;
        }
        if(j==2)
        {
          dataSet[i][j] = last_trigger;
        }
        if(j==3)
        {
          dataSet[i][j] = trigger_number;
        }
        if(j==4)
        {
          dataSet[i][j] =grb_number;
        }
        if(j==5)
        {
          dataSet[i][j] =grb_like_number;
        }
        if(j==6)
        {
          dataSet[i][j] =ste_number;
        }
        if(j==7)
        {
          dataSet[i][j] =tgf_number;
        }

        if(j==8)
        {
          var link_trend = "../agilemcal/trend.php?web_dir="+web_dir+"&file_name="+trend;
          var link_trigger = "../agilemcal/trigger.php?web_dir="+web_dir+"&orbit_number="+orbit_number;
          var link_grb = "../agilemcal/detail_orbit.php?show=1"+"&id_orbit="+id_orbit+"&orbit_number="+orbit_number;
          var link_ste = "../agilemcal/detail_orbit.php?show=2"+"&id_orbit="+id_orbit+"&orbit_number="+orbit_number;
          var link_tgf = "../agilemcal/detail_orbit.php?show=3"+"&id_orbit="+id_orbit+"&orbit_number="+orbit_number;
          var link_grb_like = "../agilemcal/detail_orbit.php?show=4"+"&id_orbit="+id_orbit+"&orbit_number="+orbit_number;
          dataSet[i][j] =" <button type=\"submit\" onclick=\"location.href='"+link_trend+"'\" class=\"btn btn-success\" >Orbit Trend</button><button type=\"submit\" onclick=\"location.href='"+link_trigger+"'\" class=\"btn btn-success\" >Triggers</button>"+" <button type=\"submit\" onclick=\"location.href='"+link_grb+"'\" class=\"btn btn-success\">GRB</button>"+"<button type=\"submit\" onclick=\"location.href='"+link_grb_like+"'\" class=\"btn btn-success\">GRBlike</button>"+"<button type=\"submit\" onclick=\"location.href='"+link_ste+"'\" class=\"btn btn-success\" >STE</button>"+"<button type=\"submit\" onclick=\"location.href='"+link_tgf+"'\" class=\"btn btn-success\" >TGF</button>";
        }
      }
    }
    if ( $.fn.dataTable.isDataTable( '#mcal_orbit_table') ) // se la tabella esiste già
    {
      var table = new $.fn.dataTable.Api( '#mcal_orbit_table' ).clear();
      table.rows.add(dataSet).draw();
    }
    else
    {
      console.log("create table");
      var table = $('#mcal_orbit_table').DataTable( {
        //  responsive:true,
        "lengthChange": false,
        "searching": false,
        "paging": false,
        "ordering": false,
        "info": false,
        "order": [[ 0, "desc" ]],
        columns: [
          { title:"Contact Number"},
          { title:"First Trigger (UTC)"},
          { title:"Last Trigger (UTC)"},
          { title:"N of triggers"},
          { title:"GRBs" },
          { title:"GRBlikes" },
          { title:"STEs"},
          { title:"TGFs"},
          { title:"Actions"}
        ]
      } );
      table.rows.add(dataSet).draw();
    }

  }).fail(function (jqXHR, textStatus) {
    console.log("error");
    console.log(textStatus);
  });

}
