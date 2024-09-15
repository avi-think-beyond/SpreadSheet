<?php
/*
====================================================================================================
Application Name: PHP_spreadsheet
====================================================================================================
          Module: tool
       File Name: index.php
          Author: Ashish Vishwakarma
    Created Date: 30- July - 2019
   Modified Date: 
     Description: 
   File Included: class/spd_function.php // main class file
Functions Called: readmaindata
----------------------------------------------------------------------------------------------------
Modification Log:

----------------------------------------------------------------------------------------------------
Ver.No.         Date            Author                          Modification
            (DD/MM/YYYY)       Ashish vishwakarma
....................................................................................................
Initial Version.                                                 
====================================================================================================
*/

include_once("class/spd_function.php");#main class file of php_spreadsheet

// $tb_name   ='purchase_inv_master'; #define table name
$tb_name   = 'authors'; #define table name
//$cols      ='DISTRIBUTORNAME, SAPCODE, REGISTERED_ADDRESS, CITY, STATE, ZONE, BRANCH, PINCODE, CONTACT_NO, PANNO, DIST_EMAIL, GST';#colummns names with "," separate
$cols      ='';
$cond      =""; #query condition exmple:- name!="abc" and surname = "xyz" 
// $cond      ="INVOICE_TYPE = 6"; #query condition exmple:- name!="abc" and surname = "xyz" 

$arr_records = $spd_obj->readmaindata($tb_name, $cols, $cond); #main function read source table data
// $save_flt    = $spd_obj->filterlist();
//print_r($arr_records);
$alldata =$arr_records['alldata'];
$filterd =$arr_records['filter'];
$header  =$arr_records['header'];
$actions =$arr_records['actions'];
?>

<!-- include css and js files -->
<link rel="stylesheet" href="css/fontawesome/web-fonts-with-css/css/fontawesome-all.css">  <!-- For font awesome icons  -->
<link rel="stylesheet" type="text/css" href="css/spd_style.css" /><!-- spd style  -->
<!-- end include files -->


<!-- html start -->
<body>
<!-- spread_sheet div start -->
<div class="sp_div">


<!-- modal  -->
<!-- <button >Open Modal</button> -->
 <div class="btnpos">
    <button class="save_filter myButton" id="myBtn" onclick="modalfn(this)"><i class="fas fa-save" style="padding-right: 5px;"></i>Save Filter</button>
    <button class="myButton" style="font-size: 15px;" id="settings" onclick="modalfn(this)"><i class="fas fa-cog settings choose_field "  style="padding-right: 5px;"></i></button>
    <button class="pgshow myButton" id="pgshow" onclick="hideshowpaging(this);"><i class="fas fa-eraser" style="padding-right: 5px;"></i> remove paging</button>
    <button class="rem_fltr reset myButton" id="rem_fltr" onclick="setFilter(this,this.id);"><i class="fas fa-retweet" style="padding-right: 5px;"></i> Reset  </button>
    <div class="upd_rcd" style="display: none;"> <button class="delete myButton" style="margin: 2px 10px; float: left;" onclick="dlt_rcd_fn(this);">Delete records</button></div>
</div>

<!-- The Modal -->
<div id="myModal" class="modal">
  <!-- Modal content -->
    <div class="modal-content">
        <div class="modal-header">
            <span class="close" style="color: black" onclick="closed(this);">&times;</span>
            <!-- <h2>Modal Header</h2> -->
        <div class="md_btn_stn">
            <button class="header_btn updateheader" style="margin-right: 18px;" onclick="showupdateheader('header',this);">update header</button>
            <button class="header_btn action" onclick="showupdateheader('action',this);">action</button>
        </div>
        </div>
        <div class="modal-body">
        </div>   
    </div>
</div>
<!-- end modal -->


 <!-- main table -->
<div class="tbldiv">
<table id="demo" class="<?php echo $tb_name; ?>">
<input type="hidden" name="filename" class="filename"  value="<?php echo $tb_name; ?>" id="filename"> <!-- hinden table name-->
<input type="hidden" name="cause" value="<?php echo $cond; ?>" id="cause">
<input type="hidden" name="tb_cols" value="<?php echo $cols; ?>" id="tb_cols">
<input type="hidden" name="filter" value="<?php if (!empty($filterd)){echo implode(',', $filterd);} ?>" id="apn_filter">
<input type="hidden" name="action" value="<?php echo $actions['action'];?>" id="spd_action">
<!-- table header -->
<thead class="tbl_header">
    <tr style="height: 35px;">
        <!-- <th>Sr.</th> -->
       
                    <?php
                            if(!empty($alldata))
                                {
                                    $th1=$th2='';
                                    $index = 1;
                                    foreach($alldata as $key => $field)
                                    {
                                        if ($index==1)
                                        { 
                                            
                                            foreach($field as $keys => $val)
                                            {
                                            	if($keys=='checkers')
                                            	{
                                                    $th1.='<th index=0 class="'.$actions["action"].'" style="text-align: center;"><input type="checkbox" name="check" class="selectAll_'.$tb_name.'" onclick=tbl_checkedboxSelected(this,"all","'.$tb_name.'");></th>';
                                            	}
                                            	else
                                                {                    
                                                    $th2.='<th data-th="'.$keys.'"><div style="display: flex;"><div class="th_text">';
                                                        
                                                        if(array_key_exists($keys, $header)){ $th2.=$header[$keys];}else{$th2.=$keys;}
                                                        $th2.="</div>";                                                    
                                                        $th2.='<div style="float:right;z-index: 5; margin-right:5px;" class="popup dropdown" onclick="dropdown(event,this);"><i class="fa fa-caret-down dropdown-toggle theadtxtcolor" type="button" style="display: inline-flex;"></i></div>';
                                                    if(in_array($keys,$filterd)){$th2.='<i class="fas fa-filter funnel"></i>'; }
                                                    $th2.= '</div></th>';                    
                                            	}
                                        	}

                                            $index++;

                                        }
                                        else
                                        {
                                        	break;
                                        }

                                    }
                                    echo $th1.$th2;
                                }
                    ?>
    </tr>
</thead>
<!-- end table header -->
<!-- start table body -->
<tbody class="tb_update">
 <?php
    $i=1;
    foreach($alldata as $key => $field)
        {
           echo "<tr>";
           // echo "<td>{$i}</td>";
            $html1=$html2='';
            foreach($field as $keys => $val)
            {

            	if($keys=='checkers')
            	{
            		  $html1.= "<td class='".$actions['action']."' style='text-align: center;'><input type='checkbox' name='check[]' value='".base64_decode($val)."' id='' class='single_".$tb_name."' onclick=tbl_checkedboxSelected(this,'single','".$tb_name."') /> </td>";
            	}
            	else{
                $html2.= "<td ondblclick='dbdragedit(this);'>".base64_decode($val)."</td>";
            	}
            }
            echo $html1.$html2."</tr>";
            $i++;
        }
  ?>
</tbody>
<!-- end table body -->
</table>
</div>
<!-- end table -->
</div>
<!-- end spread_sheet div -->
</body>
<!-- end html tags -->

<!-- script start -->
<script src="js/jquery-3.3.1.js"></script>
<script src="js/jquery-ui.js"></script>
<script src="js/jquery.base64.js" type="text/javascript"></script> <!--jquery library decode base64 encoded data-->
<script src="js/spd_main.js" type="text/javascript"></script> <!--main JS file of spreadsheet-->













