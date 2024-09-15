<?php
/*
====================================================================================================
Application Name: SCPL tool library
====================================================================================================
          Module: spd_filter
       File Name: spd_filter.php
          Author: Ashish vishwakarma
    Created Date: 30- Jul - 2019
   Modified Date: 
     Description: 
   File Included: class/spd_function.php // database connection
Functions Called: 
----------------------------------------------------------------------------------------------------
Modification Log:

----------------------------------------------------------------------------------------------------
Ver.No.			Date			Author							Modification
			(DD/MM/YYYY)
....................................................................................................
Initial Version.												 
====================================================================================================
*/

$dir = "../"; // To get one step back
include_once('class/spd_function.php');

// filter dropdown data
if(isset($_POST['type']) && $_POST['type'] == 'gcol') {
	$POST 		= array_map('trim', $_POST);
	$filename	= ($POST['filename']);
	$fieldName 	= $POST['col'];	
	$cond 		= $POST['cond'];
	$tb_cols	= $_POST['tb_cols'];
	$listArr 	= $spd_obj->dropdown($filename, $fieldName, $cond, $tb_cols);	 
	echo  json_encode($listArr);
	
}

//update filter data 
if(isset($_POST['type']) && $_POST['type'] == 'setFilter') {
	$fieldName 	= $_POST['th_col'];
	$filterData = $_POST['filterData'];
	$filename 	= $_POST['filename'];
	$cols 		= $_POST['tb_col'];
	$cause 		= $_POST["cause"];
	$returns    = $spd_obj->updateFilterData($filename, $cols, $cause, $filterData, $fieldName);
// echo "<pre>";print_r($returns);
$test = json_encode($returns);
//print_r($returns);
echo $test;
}




// if(isset($_POST['type']) && $_POST['type'] == 'resetFilter') {
// 	$filename 	= $dir.urldecode($_POST['filename']);	
// 	echo $basef->resetFilterData($filename);
// }





// save filters
if(isset($_POST['task']) && $_POST['task'] == 'sv_flt') {
	$filename 		= $_POST['file_name'];
	$flt_name 	 	= $_POST['flt_name']; 
		
	echo $spd_obj->saveFilters($filename, $flt_name);
}




// name of saved list of filters
if(isset($_POST['task']) && $_POST['task']=='list_flt')
{
	$filename    = $_POST['filename'];
	$list  		 = $spd_obj->listFilters($filename);
	echo  json_encode($list);
}


// delete save filter list
if(isset($_POST['task']) && $_POST['task']=='del_flt')
{
	echo $filename    = $_POST['file_name'];
	echo $folder 	 = $_POST['folder_name'];
	 echo $spd_obj->deleteFilter($filename,$folder);
	  
}



// show save filter data 
if(isset($_POST['task']) && $_POST['task']=='ss_flt')
{
	$filename    = $_POST['file_name'];
	$folder 	 = $_POST['folder_name'];
	$cols 		 = $_POST['cols'];
	$cause 		 = $_POST['cause'];
	$tbl_dat 	 = $spd_obj->ssfilterdata($filename,$folder,$cols,$cause);

	echo json_encode($tbl_dat);
	  
}

// ajax use for show list of columns name in setting icon
if(isset($_POST['task']) && $_POST['task']=='settings')
{
	$filename    = $_POST['filename'];	
	$tbl_detail	 = $spd_obj->gettabledetail($filename);

	echo json_encode($tbl_detail);
	  
}



if(isset($_POST['task']) && $_POST['task']=='set_header')
{
	$headers     = $_POST['headers'];	
	$new_header  = $_POST['new_header'];
	$tbl_name    = $_POST['tbl_name'];	
	$cond    	 = $_POST['cond'];	
	$tbl_data	 = $spd_obj->saveTblheader($headers,$new_header,$tbl_name,$cond);

	echo json_encode($tbl_data);
	  
}


if(isset($_POST['task']) && $_POST['task']=='update_rcd')
{
	$up_data 		=	$_POST['data'];
	$old_data 		=	$_POST['old_data'];
	$col 			=	$_POST['cols'];
	$tbl_name       =   $_POST['tb_name'];
	$cond 			=	$_POST['valdtr'];
	

	$upd_status	 	= 	$spd_obj->UpdateColData($old_data,$up_data,$col,$tbl_name,$cond);

	// echo $upd_status;

}


if(isset($_POST['type']) && $_POST['type']=='actions')
{
	$act = $_POST['val'];
	$tbl = $_POST['tbl'];

	$act_updt = $spd_obj->UpdateActionTbl($act,$tbl);

}


if(isset($_POST['task']) && $_POST['task']=='download')
{
	$tbl 	= $_POST['tb_name'];
	$cols 	= $_POST['cols'];
	$cond 	= $_POST['cond'];

	$dwn_data = $spd_obj->downloadCsvData($tbl,$cols,$cond);
	echo json_encode($dwn_data);
}
	













?>