<?php /*
====================================================================================================
Application Name: SCPL tool library
====================================================================================================
          Module: phpSpreadsheet
       File Name: spd_function.php
          Author: Ashish Vishwakarma
    Created Date: 26- jul - 2019
   Modified Date: 
     Description: This is a class file which containt multiple function. This class is basically for the phpspreadsheet functionlity.
   File Included: 
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
error_reporting(0);

include_once("config.php");
class spd_main extends config
{
		/* 
		@author 		: Ashish Vishwakarma 
		@param 			: table name, columns name, 
		@return			: $arr_records
		@Description	: this function only reade data from database which assign by user's table_name and columns and return it in array form. (based on php spreadsheet)
		@created Date	: 30-Jul-2019
		*/	 

		function readmaindata($tb_name, $cols, $condition=" ",$roottype="")#this fuction only read main data from database.
		{
			$conn 	 = $this->connect();//create connection
			$tb_name = $tb_name; #table name
			$cols    = $cols; #columns
			$cause   = $condition; #condition
			$headerArr = $filterdata = $act_arr = array('');
			$dir = $roottype.'spd_version_4_demo';
			$tbl_header = $dir."/src/header/new_header_{$tb_name}.json";
			if(file_exists($tbl_header))
			{
				 		$header_handle          = fopen($tbl_header, "r"); // open the file.            
		                $headers        		= fgets($header_handle);
		                $headerArr      		= json_decode($headers, true);
		                fclose($header_handle);
		                if(!empty($headerArr))
		                {
		                	$cols = implode(",", array_keys($headerArr));
		                	//$cols = $headerArr;
		                }
			}

			if(empty($cols))
			{
				$cols ="*";	
			}
			// dynamic query create.
			$cond 	= '';
			$qry 	= "SELECT";
			if(!empty($cause))
			{
				$cond = " WHERE " .$cause;
			}

			if(!empty($tb_name))
			{
				$qry .= " {$cols}, UID as checkers FROM {$tb_name }". $cond;
					
			}
			else
			{

			}			
			// End query creation.				
 			// echo $qry;
			// query execute
			$RESULT 	= 	mysqli_query($conn, $qry);
			// fatch data from executed query
			while($row	=	mysqli_fetch_assoc($RESULT))
			{
				$arr[]  =	array_map('base64_encode',$row);
			}
			// echo $dir."/".$tb_name."_"."Filters.json";
			// echo file_exists($dir."/".$tb_name."_"."Filters.json");
			//echo "<pre>";print_r($arr);
			$arr_records = $FilterArr = $my_array = array(); #assign array variable
		        if(!empty($arr)) //check data is not empty
		        {	           
		            if(file_exists($dir."/tmp_filter/".$tb_name."_"."Filters.json"))
		            {
		                // Get filter data from the file with postpend named "spreadsheetFilter" and decode the data in array from json if file exist
		                $handle         = fopen($dir."/tmp_filter/".$tb_name."_"."Filters.json", "r"); // open the file.            
		                $LocalDataArr   = fgets($handle);
		                $FilterArr      = json_decode($LocalDataArr, true);
		                $filterdata 	= array_keys($FilterArr);
		            }
		            if(!empty($arr))
		            {		                
		                $my_array       = $arr;	
		                	                
		                // return the data from the source json file based on the filter file
		                if(!empty($FilterArr) && !empty($my_array))
		                {
		                    foreach($FilterArr as $k => $FieldArr) 
		                    {
		                        
		                        foreach($my_array as $key => $FieldVal) 
		                        {
		                            if(in_array(base64_decode($FieldVal[$k]), $FieldArr)==false)
		                            {
		                            	unset($my_array[$key]); 		                               
		                            }
		                        }                   
		                    }
		                    
		                }
		                else
		                	{ 
		                		$arr_records = $my_array; 
		                	}
		            } 
		            else
		            	{ 
		            		$arr_records['error'] = 'The file name is not available';
		            	}
		        } 
		        else
		        	{ 
		        		$arr_records['error'] = 'The Filename (param) is empty';
		        	}


        $src2     = $dir."/src/actions/spd_action_{$tb_name}.json"; // saved action
        if(file_exists($src2))
        {
        	$handle2        = fopen($src2, "r"); // open the file.            
            $actDataArr   	= fgets($handle2);
            $act_arr        = json_decode($actDataArr, true);
        }
        else
        {
        	$act_arr        = array('action' =>'checkshow');
        }
        //$url_filename = basename($_SERVER['REQUEST_URI'], '?' . $_SERVER['QUERY_STRING']); // get the base path of the url file
       // $headerData = $this->getDataHeaderData($FILENAME, $url_filename);
          
	       $returnArr['filter']    		= $filterdata;
	       $returnArr['alldata']     	= $my_array;
	       $returnArr['header'] 		= $headerArr;
	       $returnArr['actions'] 		= $act_arr;
       // echo "<pre>";
        // print_r($returnArr['alldata']);
		        return $returnArr;
		}




		/* 
		@author 		: Ashish Vishwakarma
		@param 			: $tb_name,$col_name,$cause,$tb_cols
		@return			: $returnArr
		@Description	: This function get only one column data from table according to test of filter applied on it				  
		@created Date	: 30-Jul-2019
	*/ 
		function dropdown($tb_name,$col_name,$cause,$tb_cols)
		{
			$conn 	 = $this->connect();//create connection
			$tb_name = $tb_name; #table name
			$col     = $col_name; #selecetd th column
			$tb_cols = $tb_cols;  #tabel columns
			$cond 	 = $cause; #condition

			$condition = '';
			if(!empty($cond))
			{
				$condition ="WHERE {$cond}";
			}

			if(empty($tb_cols))
			{
				$tb_cols ='*';
			}

			
			$FilterArr = $selectedData = array();
			$LastFilter='';
			

			if(file_exists('tmp_filter/'.$tb_name."_"."Filters.json")) // if file exist on the location
			{
				$handle 				= fopen('tmp_filter/'.$tb_name."_"."Filters.json", "r"); // open the file.			
				$LocalDataArr 			= fgets($handle);		 // get data into a string		
				$FilterArr 				= json_decode($LocalDataArr, true);  // convert data into an array				
				error_reporting(0);				
				$LastFilter 			= end(array_keys($FilterArr)); //get last key of array to display data based on the field
			}
			
			
			if($LastFilter == $col){
				$selectedData = $FilterArr[$LastFilter];
				unset($FilterArr[$LastFilter]);	// remove last filter value from array so the value of the last filer should be display all the data based on the previous filter		
			}


			if(!empty($tb_name) && !empty($col)) // if source file is exist
			{
				#query which get all data from table
				$qry = "SELECT {$tb_cols} FROM {$tb_name} ". $condition; 
				// query execute
				$RESULT 	= 	mysqli_query($conn, $qry);
				// fatch data from executed query
				while($row	=	mysqli_fetch_assoc($RESULT))
				{
					$arr[]  =	$row;
				}

				$my_array = $arr; // source file data
				
				// below program will unset the unwanted data from source data file and return the filtered data into an array so that the file will display the filtered data only on the screen
				if(!empty($FilterArr) && !empty($my_array)) 
				{
					foreach($FilterArr as $k => $FieldArr) 
					{
						if($k != $col_name) 
						{
							$arr_records = array();
							
							foreach($my_array as $key => $FieldVal) 
		                        {
		                            if(in_array($FieldVal[$k], $FieldArr))
		                            {
		                            	$arr_records[$key] = $my_array[$key];		                            	
		                            }
		                            else
										{ 
											unset($my_array[$key]); 
										}
		                        }  
						}
						else 
						{
							$selectedData = $FieldArr;
							
						}
					}
				}
				else #if previous filter not used 
				{ 				
					$arr_records = $my_array; 
				} // if filter is not applied then display all the data which comes from the source file
			}

		asort($arr_records);#sort data in ascending order	
		 
		if(!empty($arr_records)) 
		{
			$resultList = array();
			foreach($arr_records as $k => $val) 
			{				
				$resultList[base64_encode($val[$col_name])] = base64_encode($val[$col_name]);	// encode data for prevent from special charectors			
			}
		}
		
				
		if(!empty($selectedData))#if previous filter used
		{
			$returnArr['selectedData'] 	= $selectedData;
		}
		$returnArr['allData'] 			=  $resultList;#main data

		return  $returnArr;
		clearstatcache(); 

		}

		


		/* 
		@author 		: Ashish Vishwakarma
		@param 			: $old_data,$upd_data, $cols, $tbl_name, $validator
		@return			: create files
		@Description	: This function update single row column data according to using uniqe id('UID') an column names				  
		@created Date	: 30-Jul-2019
	*/ 
	public function UpdateColData($old_data,$upd_data, $cols, $tbl_name, $validator)
	{
			$conn 	 = $this->connect();//create connection
			$tb_name = $tbl_name; #table name
			$col     = $cols; #field name which going to update
			$data    = $upd_data;  #modified data
			$old 	 = $old_data; #old data which updated
			$cond 	 = $validator; #validator for idenifie the row of data

			$filter_file = 'tmp_filter/'.$tbl_name.'_Filters.json'; #update filter file data

				$qry 		= "UPDATE {$tb_name} SET $col='".$data."', DATE_MODIFIED=now() WHERE UID='".$cond."'"; 
				// query execute
				$RESULT 	= 	mysqli_query($conn, $qry);
				$upd=0;
				if($RESULT)
				{
					$upd=1;
				}
				echo $upd; #return update data to ajax 

 
				// read file its work in backend							
				$files = file_get_contents($filter_file); //update temp saved filter data

				// decode json to array
				$json_arr = json_decode($files, true);				

				foreach ($json_arr as $key => $value) {
				    if($key==$col)
				    {				    	
				    	if(in_array($old,$value))
				    	{
				    		foreach ($value as $keys => $values) 
				    		{

				    			if($values==$old)
				    			{
				    			 $json_arr[$key][$keys] =$data ; // 
				    			}
				    		}
				    	}
				    }
				}

				// encode array to json and save to file
				$file = fopen($filter_file, 'w') or die("Unable to open file!");
				fwrite($file, json_encode($json_arr)); // write the json into file
				chmod($filter_file,0755); // permission grant
				fclose($file);
				clearstatcache(); 



	}
	





		/* 
		@author 		: Ashish Vishwakarma
		@param 			: $FILENAME, $cols, $cause, $FILTER_DATA, $FIELD_NAME
		@return			: $readdata
		@Description	: Update filters applied in temp filter folder for current filter processed.				  
		@created Date	: 30-Jul-2019
	*/ 
	public function updateFilterData($FILENAME, $cols, $cause, $FILTER_DATA, $FIELD_NAME)
	{
		//$conn 	 	  = $this->connect();//create connection
		$tb_name      = $FILENAME;#table name
		$cols 		  = $cols;#columns		
		// $LocalDataArr =  array();	
		// echo $FIELD_NAME;
		$dir = '../spd_version_4_demo/'; 

		$filter_filename 	= $dir.'tmp_filter/'.$tb_name."_"."Filters.json";//check filter is used or not	


		if(!empty($FILENAME) && !empty($FIELD_NAME))
		{	
			if($FIELD_NAME!='rem_fltr')
			{				
			if(file_exists($filter_filename))
			{							
				$handle 			= fopen($filter_filename, "r"); // open the file.			
				$LocalDatajson 		= fgets($handle); // get the file data							
				$LocalDataArr 		= json_decode($LocalDatajson, true); // convert into an array from json 
			}
			if(!empty($LocalDataArr)) 
			{
				if(array_key_exists($FIELD_NAME, $LocalDataArr))
				{
					unset($LocalDataArr[$FIELD_NAME]); // unset the data which has provided field name
				}
			}
			if(!empty($FILTER_DATA)){
				$LocalDataArr[$FIELD_NAME] = $FILTER_DATA; // append the same field data at the end of the array
			}
			
			if(file_exists($filter_filename)) {
				unlink($filter_filename);		 // remove the file from the location		
			}
			//echo "<pre>"; print_r($LocalDataArr);
			$file = fopen($filter_filename, 'w') or die("Unable to open file!");
			fwrite($file, json_encode($LocalDataArr)); // write the json into file
			chmod($filter_filename,0755); // permission grant
			fclose($file);
			clearstatcache(); 
			}
			else
			{
				// $dir ="src/filters/".$folder."/".$filename.".json";

				unlink($filter_filename);
			}

			$readdata = $this->readmaindata($tb_name,$cols,$cause,$dir_scr='../');
			// print_r($readdata);

		}
		return $readdata;		 
	}





	/* 
		@author 		: Ashish Vishwakarma
		@param 			: $filename, $flt_name
		@return			: ajax echo 0 or 1
		@Description	: This function only create filter save file for use next time as a set of filters				  
		@created Date	: 2-Aug-2019
	*/ 
	function saveFilters($filename, $flt_name)
	{
		$dir = "src/filters/".$filename; // filter save directory
		if(!file_exists($dir))
		{
			mkdir($dir); // create new directory
			chmod($dir,0755);
		}
		
		$read_file = 'tmp_filter/'.$filename."_Filters.json"; //temporary filter saved file 
		$sv_filters= $dir."/".$flt_name.".json";

		if(!empty($flt_name) && file_exists($read_file))  
		{
			$open_file = fopen($read_file,"r"); // read data from temporary save filter file 
			$file_cont = fgets($open_file);	// get the filter file contents		
			fclose($open_file);
			

			$new_fl = fopen($sv_filters,"w") or die("Unable to open file!");
			fwrite($new_fl,$file_cont); // update filter data in new file 
			chmod($sv_filters,0755);
			fclose($new_fl);
			
			clearstatcache(); 
			echo 1; 

		}
		else
		{
			echo 0;
		}

	}



	/* 
		@author 		: Ashish Vishwakarma
		@param 			: $filename
		@return			: $list
		@Description	: This function read the filter save data in folder and return the list of file names				  
		@created Date	: 8-Aug-2019
	*/ 
	function listFilters($filename)
	{
		$list = array();
		if(!empty($filename))
		{
			$dir  = "src/filters/".$filename; // saved filter file source		
			$files = array_diff(scandir($dir), array('.', '..'));
		
			foreach ($files as $key => $value) 
			{
				$ext = pathinfo($value, PATHINFO_EXTENSION); // get the files inside the filter folder

				if ($ext=='json') 
				{
					$list[] = str_replace('.'.$ext, '',$value); // list of file in array set
				}
			 
			}
		}
		return $list;
	}



	/* 
		@author 		: Ashish Vishwakarma
		@param 			: $filename,$folde
		@return			: string Deleted, Error
		@Description	: This function delete the saveed filter files from filtesr folder 				  
		@created Date	: 
	*/ 
	function deleteFilter($filename,$folder)
	{
		$dir ="../spd_version_4_demo/src/filters/".$folder."/".$filename.".json"; // path of deleting file.

			if (!unlink($dir)) // this php funtion remove file 
			{
			echo ("Error");
			}
			else
			{
			echo ("Deleted");
			}

		
	}



	/* 
		@author 		: Ashish Vishwakarma
		@param 			: $filename, $folder,$cols,$conn
		@return			: $readdata;
		@Description	: This function applied on when aleard user saved some filter set previously. according to filter set its return 						  filtered data				  
		@created Date	: 26-Aug-2019
	*/ 
	function ssfilterdata($filename,$folder,$cols,$conn)
	{
		$ss_dir ="src/filters/".$folder."/".$filename.".json"; // source directory of saved filter
		$fl_dir = 'tmp_filter/'.$folder."_Filters.json";

		$files  = fopen($ss_dir,"r");
		$f_cont = fgets($files);
		fclose($files);

		$fl_files = fopen($fl_dir,"w");
		fwrite($fl_files, $f_cont);

		chmod($fl_files,0755);
		fclose($fl_files);


		$readdata = $this->readmaindata($folder,$cols,$conn,$dir_scr='../');

		return $readdata;
	}


	/* 
		@author 		: Ashish Vishwakarma
		@param 			: $tablename
		@return			: $arr
		@Description	: This function get column name of table and save new update column names in config file. 				  
		@created Date	: 28-Aug-2019
	*/ 
	function gettabledetail($tablename)
	{
		$final_arr = $arr = $f_arr     = array();
		$conn 	 = $this->connect();//create connection
		$src    = "src/header/new_header_{$tablename}.json"; // save new_header
		if(file_exists($src))
			{
				$f_handler = fopen($src, "r");
				$f_cont    = fgets($f_handler);
				fclose($f_handler);
				$f_arr 	   = json_decode($f_cont,true); //updated column name array data with key set of old column names.

			}
			
		
		if(!empty($tablename))
		{
					
				$qry ="SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_NAME`='".$tablename."'";

				$RESULT 	= 	mysqli_query($conn, $qry);
				// fatch data from executed query
				while($row	=	mysqli_fetch_assoc($RESULT))
				{
					$col =$row['COLUMN_NAME'];					
					$chk =$row['COLUMN_NAME'];
					if(array_key_exists($col, $f_arr)) 
					{
						$chk =$col.'~checked'; //concatinat this value to find which column name are updated
						$col = $f_arr[$col];
					}
					$arr[$chk]  =	$col; // final set off array
					
				}
			
		}
		return $arr;
	}





	/* 
		@author 		: Ashish Vishwakarma
		@param 			: table column name, table name, query condition, new column names
		@return			: none
		@Description	: This function create on header config file which used to update new columns name updated by user				  
		@created Date	: 29-Aug-2019
	*/ 
	function saveTblheader($columns,$new_header,$tablename,$condition)
	{
		$conn 	 = $this->connect();//create connection
		// $src     = "src/header/{$tablename}.json"; // save header
		$src2    = "src/header/new_header_{$tablename}.json"; // save new_header


		$arr     = implode(",", $columns); // make  array string
		$n_h_arr = array();
		foreach ($new_header as $key => $value) {
			$n_h_arr[$columns[$key]]=$value;
		}

		$filter_filename 	= 'tmp_filter/'.$tablename."_"."Filters.json";//check filter is used or not
		if(file_exists($filter_filename)) 
		{
			unlink($filter_filename);		 // remove the file from the location		
		}

		// $file = fopen($src,"w");
		// fwrite($file,json_encode($arr));
		// chmod($src,0755); // permission grant
		// fclose($file);
		// clearstatcache(); 

		$new_file = fopen($src2, "w");
		fwrite($new_file, json_encode($n_h_arr));
		chmod($src2, 0755);
		fclose($new_file);
		clearstatcache();

	
		
		$datas = $this->readmaindata($tablename, $arr, $condition,$dir_scr='../');
		//echo "<pre>";print_r($datas);
		return $datas;
		
	}






	/* 
		@author 		: Ashish Vishwakarma
		@param 			: table name, actine flag
		@return			: create new action file
		@Description	: This function create new action config file if user applied on table				  
		@created Date	: 04-Sep-2019
	*/ 
	function UpdateActionTbl($action,$tbl_name)
	{
		$conn 	 = $this->connect();//create connection		
		$src     = "src/actions/spd_action_{$tbl_name}.json"; // save action
		$act_arr = array();

		if($action==1)
		{
			$act_arr['action']='checkhide'; // this value indication action are applied
		}
		else
		{
			$act_arr['action']='checkshow'; // if action are not applied 
		}

		$new_file = fopen($src, "w"); // create action config file
		fwrite($new_file, json_encode($act_arr));
		chmod($src, 0755);
		fclose($new_file);
		clearstatcache();

	}





/* 
		@author 		: Ashish Vishwakarma
		@param 			: tabel-name, table columns name, query condition
		@return			: array data according to selection of filter or without filter 
		@Description	: this function call main spreadsheet function according to table name, columns and condition which we are applied
							after geting the main array it manipulate the array and make one new array set data which return to javascript ajax called function.				  
		@created Date	: 06-Sep-2019
	*/ 
	function downloadCsvData($tbl,$cols,$cond)
	{
		$conn 	 = $this->connect();//create connection		
		
		$dl_data = $this->readmaindata($tbl,$cols,base64_decode($cond),$dir_scr='../'); //called main funtion
		
		$dwn_arr = array();

		if(!empty($dl_data))
		{
			$dwn_arr[] = $dl_data['header']; // only columns header data show which updated there.
			foreach ($dl_data['alldata'] as $key => $value) 
			{
				unset($value['checkers']); // this field makes spd_function use for action perform so that we remove it. 
				$dwn_arr[]=array_map('base64_decode',$value);	// return data decoded 		
			}
			
		}
		
		return $dwn_arr;

	}


}

$spd_obj =	new spd_main();

?>