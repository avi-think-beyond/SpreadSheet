 
/*---- while loading page reqired funtion are execute  ----*/
 $(document).ready(function(event) 
    { 
        // tdselectorn();
        updatepagination(); /* this funtion append pagination div on table */ 
        resized();          /* resize function used for drag columns to resize width only  */
        table_flow(); 		/* this funtion update table width dynamicaly according to get number of columns */
        drag(); 			/* this drage funtion used in modal which show number of header and change position according to drag */ 
        actionUpd();
        $('.btnpos').append('<select class="pgnselect" onchange="pgnselect(this);"><option value="10">10</option><option value="20">20</option><option value="50">50</option><option value="100">100</option></select>');
  
    });
/*------------ end loading function -----------------------*/


/*--------------- auto update width fo tables ------------------------*/
function table_flow()
    {
        var w_wdth = $(window).width(); 					/* this takas width of screen  */

        $('table').each(function(){ 
            // var w_wdth = $(this).parent('div').width(); /* takes table parent div width */
            var width=fnw =0; 
            $(this).find('th').each(function()
            {
                // // alert($(this).find('.th_text').text().length);
                // width =($(this).find('.th_text').text().length);  this takes length of charecters in columns 
                // if(width<5)
                // {
                //     width=15;
                // }
                if(($(this).attr('data-th'))=='EMAIL')
                {
                	width = 240;
                	$(this).css('width','240px');
                }
                else{
                	width = 100;
                	$(this).css('width','100px');
                }                
                

               fnw+=width;
            });
           
            if(w_wdth<(fnw))
            {
                $(this).css('width',(fnw)+'px'); 
            }
            else
            {
                $(this).css('width',(w_wdth)+'px');
            }

        }) ;    
    }
    /*------- end update width of table ---------------- */ 


    /* --------- dropdown filter action works here ----------- */
    function dropdown(e,obj)//function show filter dropdown
    {
        var hgt = $(obj).parents('table').height();       

       if(hgt<400)
       {
        $(obj).parents('table').removeAttr( "style");
       }
        

        var chk     = $(obj).find('i').hasClass("fa-filter");
        if($("div").hasClass("filter")) // this condition check other filterdropdown in not opend
        {
            //$(obj).find('i').css('');                
            $(".open").removeClass("filter");
            $(".closer").hide();
        }

        if($(obj).children().hasClass("open")) //this condition is used for if filter used on the columns to show again
            { 
                $(obj).children(".open").addClass("filter");$(obj).find(".closer").css("display",'');
            }
      
        //get details of table column name where going to filter apply 
        var tb_name = $(obj).parents("#demo").children(".filename").val();
        //var FilterLength = $(obj).children().html().length;
        var COLUMN_NAME = $(obj).parents("th").attr('data-th');

        
        var html = showData(e,obj,chk, COLUMN_NAME,tb_name);//call another function which create dynamic dropdown html tags with data
        $(obj).after(html).contents();//append dynamic created filter div on column.

    }
    /*--------------- end dropdown --------------------*/ 


        /*--------------- start dropdown div create funtion --------------------*/ 
     function showData(e,obj,chk, COLUMN_NAME,FileName)//this function get table header object,column and table_name and create filter div 
    {
        var leftPos = $(obj).position().left;   
        //var rightPos= $(window).width()  
        var widths = $(obj).parents("th").width();
        var height = ($(obj).parents("th").height())+3;
        var pos = widths-250;

            if(e.pageX <= 250)
            {
                pos=0;
            }
        var css     = "";
        var COLUMN_NAME = COLUMN_NAME;

        var html = '<div class="filter open" style="left:'+pos+'px; top:'+height+'px;">';
        html += '<div class="closer" style="padding-top: 0px; padding-bottom: 0px; left:0 !important;'+css+'">';
        html += '<div class="" style="padding-left: 0px;padding-right: 0px; border: 1px solid #9b9999;background-color: #FAFAFA ;">';
        html += '<div class="" style="padding-left: 0px;padding-right: 0px;">';
        html += '<div style="height: 330px;background-color: #E9EEEE;text-align: center; float: left;padding-right: 5px; padding-left: 5px;padding-top: 3px;border-right: 1px solid #7B7B7B;">';
        html += '<div style="" class="pointer">';
        html += '<img src="images/atoz.png" onclick=sortTable(this,"asc") style="width: 20px; height: 20px; margin-bottom: 7px;">';
        html += '</div>';
        html += '<div class="pointer">';
        html += '<img src="images/ztoa.png" onclick=sortTable(this,"desc") style="width: 20px; height: 20px;">';
        html += '</div>';
        html += '</div>';
        html += '</div>'; 
        html += '<div class="" style="margin-top: 7px;">';
        html += '<div style="padding-left: 40px;margin-bottom: 2px;" class="spfont pointer" onclick=sortTable(this,"asc");>Sort A to Z';
        html += '</div>';
        html += '<div style="padding-left: 40px;" class="spfont pointer" onclick=sortTable(this,"desc");>Sort Z to A';
        html += '</div>';
        html += '</div>';
        html += '<div class="" style="">';
        html += '<hr>';
        html += '</div>';
        html += '<div class="" style="padding-left: 40px;">';
        html += '<input class="spfont" style="" type="text" onKeyUp=searchkey(this.value,"'+COLUMN_NAME+'"); name="search" value="" placeholder="Search..">';
        html += '</div>';
        html += '<div class="" style="">';
        html += '<hr>';
        html += '</div>';
        html += '<div  class="" style="">';
        html += '<div id="checkchekbox_'+COLUMN_NAME+'" class="" style="height: 230px; background-color: white;overflow: auto;"> <div id="loading_image" > <img src="images/loading.gif" /> </div>'+getSerchContent(COLUMN_NAME,obj,FileName); //call this function gether fiter data in dropdown for perticular columns.
        html += '</div>';
        html += '</div>';
        html += '<div class="filter_button" style="">';
        html += '<button class="spfont sp_ok" id="exceltn_'+COLUMN_NAME+'" data-column="'+COLUMN_NAME+'"  onclick="setFilter(this);" style="margin-left: 11px;margin-right: 5px;">OK</button>';
        html += '<button class="spfont sp_cancel" onclick="hidePOP(this)">Cancel</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';   
        html += '</div>';
      return html;
    }
    /*--------- end dyanamic add div funtion in dropdown ----------------------*/ 
 


    /*--------------This function get parameter like obj, column_name and table_name and pass data through ajax and get result to dropdown -----*/
function getSerchContent(col,obj,filename,req_type ="gcol")
{   
    var cause = $("#cause").val();
    var tb_cols  = $("#tb_cols").val();
    var  html = ''; 
    $('#checkchekbox_'+col).html(html);
    $.ajax
    ({
        url: 'spd_ajax.php', 
        type: 'POST', 
        data: {'type':req_type,'col':col,'filename':filename, 'cond':cause, 'tb_cols':tb_cols}, 
        beforeSend: function() {$("#loading_image").css('display','block');},
        success: function (data) 
        {    
            var json_obj = $.parseJSON(data);
            console.log(json_obj.allData);
            if(json_obj != '') 
            {             
                html = '<div style="padding-left: 5px;"><label class="checklabel label-for-check"><input class="excelcheck check-with-label selectall_'+col+'" id="selectall_'+col+'" type="checkbox"  name=checkb["'+col+'"][] onclick=checkedboxSelected("all","'+col+'",this); value="0" ><span class="spantexthighlight"> (Select All)<span></label></div>';                 
                $.each(json_obj.allData, function(key, value){
                    if(value!=''){
                    var selectedField = '';
                    var value = $.base64.decode(value); // decode the base64 key into string 
                   
                    if(jQuery.inArray(value, json_obj.selectedData) != -1) { // checkbox of the each field should be check if exist into filter data
                        selectedField = 'checked = "checked"';
                    }                   
                                                   
                    html += '<div style="padding-left: 5px; white-space:nowrap !important;"><label class="checklabel label-for-check" style="padding-right: 10px;"><input class="excelcheck check-with-label single_'+col+'" type="checkbox" name=checkb["'+col+'"][] onclick=checkedboxSelected("single","'+col+'",this); value="'+value+'" '+selectedField+' group="" ><span class="spantexthighlight">'+value+'</span></label></div>'; 
                }
                });
                $("#loading_image").hide(); // hide loader
                // alert($(obj).siblings('.open').attr('class'));
                $(obj).siblings('.open').find('#checkchekbox_'+col).html(html); // innerHTML replace html code on the coresponding ID
                //checkedboxSelected('single', col, obj); // select all checkbox should be selected if all the children are selected              
            }
        }
    });
    return '';
}
/*-------------  end -------------------*/


/*---------------- To search content from the filter list into the popup area -----------------*/
function searchkey(input,COLUMN_NAME) 
{   
    var  input,filter, ul, li, a, i; 
    filter  = input.toLowerCase(); 
    div     = document.getElementById("checkchekbox_"+COLUMN_NAME); 
    a       = div.getElementsByTagName("div");
    for (i = 0; i < a.length; i++) 
    {
        txtValue = a[i].textContent; 
        if (txtValue.toLowerCase().indexOf(filter) > -1) { a[i].style.display = "";} else { a[i].style.display = "none";}
    }
}
/*-------- End search ---------*/ 

/*------  hide dropdown popup --------*/ 
function hidePOP(obj)
 {   

    $(".closer").fadeOut(400); //by using dropdwon div class hide it
    $(obj).parents('.filter').remove();     
    var chk =$(obj).parents('th').find('i').attr('data-chk');    
    appndfilter(obj,chk); //called to this function for append the filter funnel icon on header

 }
 /*------- end hide dropdown popup --------*/ 


 /*------- start get data by selected in dropdown --------*/
 function setFilter(obj,typ='')
 {
    var cause 		= $(obj).parents('.sp_div').find('table').children("#cause").val();     /* condtion applyied on query */
    var cols  		= $(obj).parents('.sp_div').find('table').children("#tb_cols").val();   /* columns name */ 
    var tb_name 	= $(obj).parents('.sp_div').find('table').children(".filename").val();  /* table name */
    var chk  		= '' // filter icon apply
    var allVals  		= new Array();
    var selectedVals 	= new Array();  // get fields which is selected for filter
    if(typ=='')
    {
    var col_name = $(obj).attr('data-column');
    $(obj).parents("th").find('.single_'+col_name+':checked').each(function()
        {
        	// console.log($(this).val());
            selectedVals.push($(this).val()); /* this gets all the selectd data and push in array */
        });
    }
    else
    {
      col_name =typ;    //this is the identifier to update filter use in class function.
      chk      =typ;
    }

    if(selectedVals=='' && typ=='')
    {
        chk = 'nofilter'; //its for append filert or not on header to use identifier in js
    }

    $.ajax
    ({
        url     : 'spd_ajax.php',
        type    : 'POST',
        data    : {'type':'setFilter','th_col':col_name,'filename':tb_name,'tb_col':cols, 'cause':cause, 'filterData':selectedVals},
        // beforeSend: function() {$("#loading_image").show();}, 
        success: function (data)  {
            console.log(data);
            var json_obj = $.parseJSON(data);       
            // console.log(json_obj);
            var actn = json_obj.actions.action; // this will indicate what kinds of action applied 

            var tr=''; // empty rows assigm

            $.each(json_obj.alldata,function(key,value){ // create new set of rows according to filtterd data
              var tr1=tr2 ='';
                tr +='<tr>';
                
                $.each(value,function(keys,values)
                {    
                	if(keys=='checkers')
                	{
                		tr1+='<td index=0 class="check thheading '+actn+'" style="text-align: center;"><input type="checkbox" name="check[]" value="'+$.base64.decode(values)+'" id="" class="singles_'+tb_name+'" onclick=tbl_checkedboxSelected(this,"single","'+tb_name+'");></td>';
                	} 
                	else{
                		tr2+="<td ondblclick='dbdragedit(this);''>"+$.base64.decode(values)+"</td>"; 
                	}              
                                    

                });             
                tr+= tr1+''+tr2+"</tr>";   // concatinat rows for some condition applied    
            });
                    
           
            $(obj).parents('.sp_div').children('.tbldiv').find(".tb_update").html(tr).contents(); // appned rows only in table body.
            actionUpd(obj); 
         //    if(actn=='checkshow')
         //    {
         //    $(obj).parents('.sp_div').children('.tbldiv').find(".thheading").css('display','none');
         //    $(obj).parents('.sp_div').find('#spd_action').val(actn);
        	// }
        	// else if(actn=='checkhide')
        	// {
        	// 	$(obj).parents('.sp_div').children('.tbldiv').find(".thheading").css('display','block');
        	// 	$(obj).parents('.sp_div').find('#spd_action').val(actn);
        	// }

            
            updatepagination(obj);  // call pagination function            
            appndfilter(obj,chk);   // appned filter funnel icon 
            // tdselectorn();          // table row selecter
            resized();              // reside column function call
            hidePOP(obj);           // hide filter dropdown 
                
        }
        
    });
    
 }
 /*--------- END ---------*/ 


/*---------- append funnel icon on filterd columns ----------*/ 
function appndfilter(obj,chk)
{
   if(chk=='true' || chk=='')
    {
        var chk2 = $(obj).parents('th').find('i').hasClass("fa-filter");

        if(chk2==false)
        {
            $(obj).parents('th').find('i').append('<i class="fas fa-filter" style="color: white;"></i>');
        }
    
    }
    if(chk=='nofilter')
    {
        // $(obj).parents('.sp_div').children('table').find('i .fa-filter').remove();
        //$(obj).parents('.sp_div').find('table').children('thead').find('i .fa-filter').remove();
        $(obj).parents('th').find('.fa-filter').remove();
    }
    if(chk=='rem_fltr')
    {        
        $(obj).parents('.sp_div').find('table').children('thead').find('.fa-filter').remove();
    }
    
}

/*---------- End Filters Update----------*/ 


/*<!-- start sorting -->*/
function sortTable(obj,srt)
{
  if(srt=='asc')
  {
    fix = 1
  }
  else
  {
    fix = -1;
  }

    var n       = $(obj).parents('th').index();      
    var rows    = $(obj).parents('table').find('tbody tr').get();
  
    rows.sort(function(a, b) 
        {

            var A = getVal(a);
            var B = getVal(b);

        if(A < B) 
        {
            return -1*fix;
        }
        if(A > B) 
        {
            return 1*fix;
        }
        return 0;
    });

    function getVal(elm)
        {
            var v = $(elm).children('td').eq(n).text().toUpperCase();
            if($.isNumeric(v))
            {
                v = parseFloat(v,10);
            }
        return v;
        }

    $.each(rows, function(index, row) 
    {
        $(obj).parents('table').find('tbody').append(row);
    });
}
/*<!-- end sorting -->*/




/*---------- Select checkbox in dropdown  ------------*/
// select all and select single check box functionlity 
function checkedboxSelected(type, col= '', obj= '')
{	
    if(type == 'single') //this for single checkbox selected
    {      
        
        if($(".single_"+col).length == $(".single_"+col+":checked").length)  // this condition check how many checkbox selected
            { 
                $("#selectall_"+col).prop("checked",true);  // if all checkboxed are selected than select all by default checked
            } 
        else 
            { 
                $("#selectall_"+col).prop("checked", false); 
            }
    } 
    else if(type == 'all') // select all funtion work here
    {   
        if($("#selectall_"+col).prop("checked") == true) 
            { 
                $(".single_"+col).prop("checked",true); 
            }
        else 
            { 
                $(".single_"+col).prop("checked", false); 
            }  
    }
    else{ alert("Invelid Request!"); }
}

/*-------- end of select all function --------*/ 




/*------------ table action checkbox selections ------------*/ 
// select all and select single check box functionlity for table 
function tbl_checkedboxSelected(obj,type, col)
{
	checks = $(".singles_"+col).length;

	s_checks = $(".singles_"+col+":checked").length;


    if(type == 'single')
    {       
        if(checks == s_checks) { $(".selectAll_"+col).prop("checked",true); } 
        else { $("#selectAll_"+col).prop("checked", false); }
    } 
    else if(type == 'all')
    {   
        if($(".selectAll_"+col).prop("checked") == true){ $(".singles_"+col).prop("checked",true); }
        else { $(".singles_"+col).prop("checked", false); }  
    }
    else
    	{ 
    		alert("Invelid Request!"); 
    	}

    	/* ---start hide and show delete button   --*/
    	pars = $(obj).parents('.sp_div').find('.upd_rcd');
    	if(($(".singles_"+col+":checked").length)>0)
    	{
    		$(pars).css('display','');
    	}
    	else
    	{
    		$(pars).css('display','none');
    	}
    	/* ---end  hide and show delete button   --*/

}

/*------------end table action checkbox selection */ 



/*-----------start update filters----------------*/
function usedfilter(obj,filters='')
{
var res='';
$('table').each(function()
{
	var par = $(this); // parent table 
   	var apl_flr = $(this).find('#apn_filter').val(); //get data of filters columns
    res= (filters==''?apl_flr.split(","):filters);  // condition check filter is empty than use hidden field data else filters data
    $.each(res,function(key,value)
            {
                $(par).find("th").each(function()
                    {

                    	console.log($(this).text());
                        if(value == $(this).text()) // match filter column name to table column names
                        {
                            
                            $(this).find('i').parent('div').after('<i class="fas fa-filter funnel" style="color: white;"></i>'); 
                        }                       
                    });
            });
});
 table_flow();
}



/*<--start hide dropdwon outter click or scroll -->*/

$(document).mousedown(function(e)  // onclick 
{

    var container = $(".filter");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        $(".filter").remove();
        $(".closer").fadeOut(400);
    }
});

$('div').scroll(function(){ // on scroll
     $(".filter").remove();
   $(".closer").fadeOut(400);
})
/*<------------------------------end hide dropdwon outter click or scroll --------------------------------->*/



/*----------------------------- modal start ------------------------------*/
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


function modalfn(obj) //
{
    // $('.modal-body').slideToggle();
    var mode  = $(obj).attr('id');//get id of click button to check which modal data have to show
    var items = [];
    var files = $(obj).parents('.sp_div').children('.tbldiv').find('.filename').val(); // get table name
    var actn = ($(obj).parents('.sp_div').children('.tbldiv').find('#spd_action').val()=='checkhide')?'checked':''; // make checked checkbox
    var cols  = $(obj).parents('.sp_div').children('.tbldiv').find('#tb_cols').val(); // table columns 
    var cause = $.base64.encode($(obj).parents('.sp_div').children('.tbldiv').find('#cause').val()); // condition to apply on query
    
 // singal modal used to show multiple data as per clicked buttone
    if(mode=='settings')
    {
    	$('.modal-header').css('display','');
 		html='';
 	    html+='<div class="tbl_act_btn md_hide"><input type= checkbox name=actions[] value="1" '+actn+'/> checkbox </div>'; 

        if(cols=='')
        {
            $.ajax
                ({
                    type:"POST",
                    url:"spd_ajax.php",
                    data:{task:"settings",filename:files},
                    success:function(list)
                    {

                        var lists   = $.parseJSON(list); // list of table columns get in return
                            html    += '<div class="md_div md_hide" style="display:;"><div class="drags" style="margin-left: 0px;"><input type="checkbox" id=selectall_ class="update_tbl_cols" name="update_cols[]" onclick=checkedboxSelected("all",""); style="margin-right: 20px;"><div style="width: 100%;">(Select all)</div></div><ul id="sortable" onclick="drag();" style="padding-inline-start:0px;">';
                        $.each(lists,function(key,value)
                            {
                               chk = '';
                               keys = key.split('~');
                               if(key.indexOf("~checked")>-1)
                               {
                                chk='checked';
                               }

                                html+='<div class="drags"><input type="checkbox" class="single_ update_tbl_cols" name="update_cols[]" value="'+keys[0]+'" style="margin-right: 20px;" '+chk+' onclick=checkedboxSelected("single","")><div ondblclick="dbdragedit(this);" style="width: 100%;">'+value+'<i class="fas fa-arrows-alt fa_drag"></i></div></div>';

                            });
                       html+='</ul></div><button class="save_filter update_btn approve md_hide" style="margin: 8px 10px; float: right;" id="update_cols" onclick="update_cols(this)"><i class="fas fa-thumbs-up" style="padding-right: 5px;"></i>UPDATE</button>';
                        
                        $(obj).parents('.btnpos').siblings('.modal').find('.modal-body').html(html).contents();

                    }
                });
        }
        else{
            
            }
    }
    else //this used for save filter modal and show saved filters
    {
    	$('.modal-header').hide();
    $.ajax({
            type:"POST",
            url:"spd_ajax.php",
            data:{task:"list_flt",filename:files},
            success:function(list)
            {
                var lists = $.parseJSON(list);
                var html = ' <span class="close" style="color: black" onclick="closed(this);">&times;</span><div style="padding-top: 30px;display: flex;"><input type="name" name="filter_name" value="" id="filter_name"><input type="button" class="sv_flt" value="save filter" id="'+files+'" onclick=sv_flt(this,"'+files+'");></div>';
                $.each(lists,function(key,value)
                {
                    html+=' <div class="spdrow"><label class="container"><input type="radio" name="radio" onclick=showsetflt(this,"'+$.base64.encode(value)+'","'+files+'","'+cols+'","'+cause+'");><span class="checkmark"></span>'+value+'</label><div><i class="fas fa-trash-alt delete" onclick=delfilter(this,"'+$.base64.encode(value)+'","'+files+'");></i></div></div>';
                });
                               
                $(obj).parents('.btnpos').siblings('.modal').find('.modal-body').html(html).contents();

            }
    });             
    }
    
  $(obj).parents('.btnpos').siblings('.modal').css('display','block');
  // close();
}

// When the user clicks on <span> (x), close the modal
function closed(obj)
{  

    $(obj).parents('.modal').css('display','none');

}

/*-------------END modal -----------------*/ 



/*-------- Save filter according to set filter--------------*/ 
function sv_flt(obj,filename)
        {
            var chk         = $(obj).parents('.sp_div').find('i').hasClass('fa-filter'); //check filter are applied or not
            var flt_name    = $('#filter_name').val();  //get input value of save filter    
            if(chk==true && flt_name!='')
            {
                  
            $.ajax({
              type:"POST",
              url:"spd_ajax.php",
              data:{task:'sv_flt',file_name:filename,flt_name:flt_name},
              success:function(result)
              	{                
                  	alert("filter saved");                   
               	}
             });
            }
            else
            {
                alert('invalid filter apply');
            }
             modal.style.display = "none"; 
        }    

/*---------------End save filter -------------------*/ 



/*--------------------- this function show data when user click on any saved filter. accroding to saved filter data will come ---------*/ 
function showsetflt(obj,filename,folder,cols,cause)
    {
        var cond   = $.base64.decode(cause); //condition
        var files  = $.base64.decode(filename); // table name
        var folder = folder; // folder to be create at pr table name
        var table  = $(obj).parents('.sp_div').find('#filename').val();
        var chk    ='';
        $.ajax({
            type:"POST",
            url:"spd_ajax.php",
            data:{task:'ss_flt',file_name:files,folder_name:folder,cols:cols,cause:cond},
            success:function(data)
            {
                var json_obj = $.parseJSON(data);   
                var actn = json_obj.actions.action;
	            var j  =1;
	            var tr=th1=th2='';
	            var th ='<tr>';            
            	$.each(json_obj.alldata,function(key,value){
                tr +='<tr>';  
                var tr1=tr2 ='';              
                $.each(value,function(keys,values)
                {                
               		if(j==1)
                    {
                    	if(keys=='checkers')
                    	{
                    		th1+='<th data-th="'+keys+'" class="'+actn+' thheading" style="text-align: center; height:35px;"><input type="checkbox" name="check" class="selectAll_'+table+'" onclick=tbl_checkedboxSelected(this,"all","'+table+'");></th>';
                    	}
                    	else
                    	{
                        th2+='<th style ="height:35px;" data-th="'+keys+'"><div style="display: flex;"><div class="th_text">'+keys+'</div><div style="float:right;z-index: 5; margin-right:5px;" class="popup dropdown" onclick="dropdown(event,this);"><i class="fa fa-caret-down dropdown-toggle theadtxtcolor" type="button"></i></div></div></th>';
                    	}
                    }  
                    if(keys=='checkers')
                    	{
                    	tr1+='<td index=0 class="check thheading '+actn+'" style="text-align: center;"><input type="checkbox" name="check[]" value="'+$.base64.decode(values)+'" id="" class="singles_'+table+'" onclick=tbl_checkedboxSelected(this,"single","'+table+'");></td>';
                    	}
                   else 	
                    {
                    	tr2+="<td ondblclick='dbdragedit(this);'>"+$.base64.decode(values)+"</td>";  
                    }                                  

                }); 

                tr+=(tr1+''+tr2)+"</tr>";
                j++;        
            });
             th+=(th1+''+th2)+"</tr>" ;                   
            
            $(obj).parents('.sp_div').find('table').children('.tbl_header').html(th);
            $(obj).parents('.sp_div').find('table').children(".tb_update").html(tr);   
            modal.style.display = "none";         
            updatepagination(obj);     
 			usedfilter(obj,json_obj.filter);
 			resized();
 			actionUpd(obj);
			// tdselectorn(); 
            }
        });
    }


/*----------END Show save filter data-------------*/ 



/*---------------------  update which columns have to show and display and apply action checkboxes ---------------------*/
   function update_cols(obj)
    {
        var cols_arr 	= new Array();
        var header_name = new Array();
        var para     	= $(obj).parents('.sp_div').find('table');
        var tab_name 	= para.find('.filename').val();
        var cause    	= $.base64.encode(para.find('#cause').val());
        var chk      	= 1;
        var validat 	= $(obj).attr('id'); // id of button which indicate which opetion have to perform.  

	    if(validat=='header')  // modal show table columns header name which one have to show in table
	    {
	        $(obj).siblings('.md_div').children('ul').find('input:checked').each(function()
	        {                 
	            var col=headr='';
	            col = $(this).val();  // old column value
	            cols_arr.push(col);

	            headr = $(this).siblings('div').text(); // new update column names
	            header_name.push(headr);
	            if(col!=headr)
	            {
	            	chk = 2;
	            }
	           
	        });

	        $.ajax
	        ({
	            type:"POST",
	            url :"spd_ajax.php",
	            data:{task:'set_header',headers:cols_arr,new_header:header_name,tbl_name:tab_name,cond:$.base64.decode(cause)},
	            success:function(data)
	            {                
	                var json_obj = $.parseJSON(data);           
	                var j  =1;
	                var tr=th1=th2='';
	                var th ='<tr>';
	               
	            $.each(json_obj.alldata,function(key,value)
	            {
	                tr +='<tr>';
	                var tr1=tr2 ='';                 
	                $.each(value,function(keys,values)
	                {   
	                    if(j==1)
	                    {
	                    	if(keys=='checkers')
	                    	{
	                    		th1+='<th data-th="'+keys+'" class="thheading '+json_obj.actions['action']+'" style="text-align: center; height:35px;"><input type="checkbox" name="check" class="selectAll_'+tab_name+'" onclick=tbl_checkedboxSelected(this,"all","'+tab_name+'");></th>';
	                    	}
	                    	else
	                    	{
	                        th2+='<th style ="height:35px;" data-th="'+keys+'"><div style="display: flex;"><div class="th_text">'+keys+'</div><div style="float:right;z-index: 5;" class="popup dropdown" onclick="dropdown(event,this);"><i class="fa fa-caret-down dropdown-toggle theadtxtcolor" type="button"></i></div></div></th>';
	                    	}
	                    }  
	                    if(keys=='checkers')
	                    	{
	                    	tr1+='<td index=0 class="check thheading '+json_obj.actions['action']+'" style="text-align: center;"><input type="checkbox" name="check[]" value="'+$.base64.decode(values)+'" id="" class="singles_'+tab_name+'" onclick=tbl_checkedboxSelected(this,"single","'+tab_name+'");></td>';
	                    	}
	                   else 	
	                    {
	                    	tr2+="<td ondblclick='dbdragedit(this);'>"+$.base64.decode(values)+"</td>";  
	                    }     

	                }); 

	                tr+=(tr1+''+tr2)+"</tr>";
	                j++;        
	            });
	             th+=(th1+''+th2)+"</tr>" ;                   
	            
	            $(obj).parents('.sp_div').find('table').children('.tbl_header').html(th);
	            $(obj).parents('.sp_div').find('table').children(".tb_update").html(tr);   
	            modal.style.display = "none";     
	           
	            updatepagination(obj);
	            if(chk==2)
	            {
	            	aliseheader(obj,tab_name); //update new column name 
	            }
	                        
	            usedfilter(obj,json_obj.filter); 
	            resized();
                actionUpd(obj)
	            // tdselectorn(); 

	            }
	        });
	    }

	    else // update action data
	    {
	    	var col = headr ='';
	        var par = $(obj).parents('.sp_div'); // action columns are updated or not  
	        var btn = $(obj).parents('.sp_div').find('#spd_action');
	    	$(obj).siblings('.tbl_act_btn').find('input:checked').each(function()
	        { 
	         col = $(this).val();
	            if(col==1)
	            {
	            	$(btn).val('checkhide'); // update button value for identifie what applied previously
	            	$(par).each(function()
        				{	
        					// $(this).find('.popup').css('display','none');
        					$(this).find('.checkshow').show();
                             $(this).find('.checkhide').show();
        				});
	            }                
	           
	        });

	        if(col=='')
	        {
	        	// alert(col);
	            $(par).each(function()
                    {   
                        $(btn).val('checkshow');
                        $(this).find('.checkhide').hide();
                        $(this).find('.checkshow').hide();
                    });
	        }	
	        // update config for reused action after reload page    	
	        $.ajax({ 
	        			type:'POST',
	        			url:'spd_ajax.php',
	        			data:{type:'actions',val:col,tbl:tab_name},
	        			success:function(rtn)
	        			{

	        			}


	            	});

	    }

         modal.style.display = "none";
    } 
/*-------------- End apply header and actions-----------------------*/ 


/*---------------- alise new updated table columns name --------------------*/ 
function aliseheader(obj,tab='')
{   
	if(obj!=null)
    {
        var table = $(obj).parents('.modal').siblings('.tbldiv').children('table');
        $.getJSON( "src/header/new_header_"+tab+".json", function( data ) 
        {           
            $.each( data, function( key, val ) 
            {    
                keys = key.split('_');             
                $(table).find('th').each(function()
                {
                    if(($(this).attr('data-th'))===keys[0])
                    {                       
                        $(this).find('.th_text').text(val);                        
                    }
                });            
            });  

        });   
    } 
}

/*--------END of alise header of table-------*/ 


/*-------------Delete save filters---------------*/ 
function delfilter(obj,filename,folder) //this function delete config file of filter save on perticular location
{
 var file = $.base64.decode(filename);  
    $.ajax({
            type:"POST",
            url:"spd_ajax.php",
            data:{task:'del_flt',file_name:file,folder_name:folder},
            success:function(){
                // $(obj).parents('.spdrow').html(''); 
                $(obj).parents('.spdrow').remove(); 
             
            }
    });
}

/*--------------- End delete save filter---------------------*/ 



/*---------------------drag and drop table column name ------------------*/ 
function drag() { 
    $( "#sortable" ).sortable(); //jquey lobrary used for drag and drop.
    $( "#sortable" ).disableSelection();
  }
/*---------------end drag----------*/ 


/*---------Edit column name on duble click function----------------*/
function dbdragedit(obj)// edite column name
  {
    // var width = $(obj).width();    
    var height= $(obj).height();
    var data  = $(obj).text();
    $(obj).html('<input type="text" id="dragedit" onfocusout="editheadertext(this,this.value)" style="height:'+height+';width:100%" placeholder="'+data+'" value="" focuson>');
		
	focusinpt(obj); //focus on update column name input field. 
  } 
/*------------End edit function-------------------*/ 

/*------ focus in input field where double click event execute--------*/ 
function focusinpt(obj)
  {
    $(obj).find("#dragedit").focus();
  }
/*---------End focus in---------------*/ 


/*------------------- Update Edited text ----------------------------*/ 
// this function used in coulumn header update and table cell data update.
function editheadertext(obj,data)
  {
  	
  	var prnt = $(obj).parent().prop("tagName"); //check which data have to update 
  	var old  = $(obj).attr('placeholder'); // find previous data
   
   if(data=="")
   {
    data = old; 
   }

	   if(prnt=='DIV') // this used for table columns name update
	   	{
	   		$(obj).parent('div').text(data);
		}

		else if(prnt=='TD' && data!=old) // this condition used to update table cell data.
		{
			var tb_name		= $(obj).parents('table').attr('class'); //find class for create dynamicaly
			var indx 		= $(obj).parent('td').index();		//index number of cell	
			var cl_upd 		= $(obj).parents('table').find('th').eq(indx).attr('data-th');	//column name which going to be update		
			var validator	= $(obj).parents('tr').find('.singles_'+tb_name).val();	//unine record number of row
			            
			$.ajax({
						type:"POST",
						url:"spd_ajax.php",
						data:{task:'update_rcd',data:data,old_data:old,valdtr:validator,cols:cl_upd, tb_name:tb_name},
						success:function(rtn)
						{
							if(rtn==1)
							{
			 					alert('Record Updated');
							}
							else
							{
								alert('Data not updated');
							}
						}
			});	
				
			
		}			
		else
		{
			alert('invalid input');
		}
		$(obj).parent('td').text(data);		

   $(obj).remove();
  }
/*-------------- End update edited data -----------------*/ 

/*------------this function validate modal header and show according to click on header button----------*/ 
function showupdateheader(type,obj)
{
	var btn =$(obj).parents('.modal-header').siblings('.modal-body').children('button');
	if(type =='header')
	{
		$(obj).parents('.modal-header').siblings('.modal-body').children('.md_div').removeClass('md_hide');
		$(obj).parents('.modal-header').siblings('.modal-body').children('.tbl_act_btn').addClass('md_hide');
		$(btn).attr('id', 'header');
	}
	if(type =='action')
	{
		$(obj).parents('.modal-header').siblings('.modal-body').children('.md_div').addClass('md_hide');
		$(obj).parents('.modal-header').siblings('.modal-body').children('.tbl_act_btn').removeClass('md_hide');
		$(btn).attr('id', 'actions');
	}
	$(btn).removeClass('md_hide');
	
		
}
/*--------- End modal header show-------------*/ 


/*--------------------Start Add pagination dynamicaly-----------------------*/ 
function pgnselect(obj)
{
	updatepagination(obj);
}

function updatepagination(obj)
    {       
        var main_tbl    = $('table'); // multiple tables   
            
        if(obj!=null) // get the objet of table where apply pagination
        {   
            main_tbl	=	$(obj).parents('.sp_div').find('table');            
            pos     	= 	$(obj).parents('.spdpagination').siblings('.tbldiv');
            $(obj).parents('.sp_div').children('.spdpagination').remove(); // if already exit to remove and update           
            
        }

        //position of page number.
        var showcnt = ($('.pgnselect').val()!=null)?$('.pgnselect').val():10; // count of rows shown.

        var pages   = subtr = 0; // number of pages.
        main_tbl.each(function(){
           var pagenum = activity = ($(obj).attr('data-paging')!=null)?($(obj).attr('data-paging')):0;
            table   = $(this);     

            
        var rowcnt  = table.children('tbody').find('tr').length; //count of tbody rows       
        var rows    = table.children('tbody').find('tr'); //get rows in variabl
        var cnt     = Math.ceil(rowcnt / showcnt);//create pagination div

            if(pagenum<=cnt)
            {
            str     = ((pagenum*showcnt)+1)*1 ;
            }
            else
            {
            str     = (((cnt*showcnt)+1)-showcnt)*1 ;  
            }
        var ls_str  = ((str-1)+(showcnt*1))*1;    
        var lst     = (str<=(rowcnt-showcnt))? ls_str : rowcnt;    

        var nav     = '<div class="spdpagination">';
        nav 	   += '<a class="pgn_btn" id="prev" onclick="updatepagination(this);" data-paging="'+((pagenum-1)<0?0:(pagenum-1))+'">prev</a>';
        var frwd    = '<a class="pgn_btn" onclick="updatepagination(this);" data-paging="'+(((pagenum*1) + 1)>cnt?(pagenum*1):(pagenum*1) + 1)+'">next</a>'; 
        var goto    = '<input type="text" class="input_pg" placeholder="goto" data-paging="" name="gopage"><button class="pgn_btn" name="pggobtn" id="pggobtn" onclick="gotopaging(this)" style="min-width: 54px;">go</button>';
        var pageinfo= ' Page-count:'+ cnt +' &nbsp Showing '+str +' to '+lst;
        var records = ' &nbsp total records: '+rowcnt;

        if(pagenum>=cnt)
        {
            pagenum=(cnt-1);
        }
          
        if(cnt>5)
        {
            subtr=3;
        }
       
        for(var i =0; i <(cnt-subtr); i++) //get number of pages come accros shown in rows of table
            {
                if(i<cnt)
                {
                    pages       = (i+((pagenum*1)>1?((pagenum*1)-2):0));
                    if(pages<cnt)
                    {

                    var pgdata  = '<a class="paging_btn" id="pgn'+(pages)+'" style="width: 20px;" onclick="updatepagination(this);" data-paging="'+pages+'">'+(pages+1)+'</a>';
                    if(subtr==3)
                    {
                        if(i<=4)
                        {
                            nav += pgdata;
                        }                    
                    }
                    else
                    {
                        nav += pgdata;
                    }
                    }
                }
            }

        nav+=frwd+goto+pageinfo+records+'</div>';

        for(j=0; j<rowcnt; j++) //show rows accroding to pages
            {
                if (j >= (showcnt * (pagenum*1)) && j < (showcnt * ((pagenum*1) + 1))) 
                    {                  
                        $(rows[j]).show();
                    } 
                    else{
                        $(rows[j]).hide();
                    }
            }  

           table.parents('.tbldiv').after(nav);  
            
           if(activity!='')
            {            
                $(pos).siblings('.spdpagination').find('*[data-paging="'+pagenum+'"][id="pgn'+pagenum+'"]').addClass('active');
                 //append active call on click of pagination button.    
            }
           
            });       

    }
/*------------End pagination---------------*/ 

/*-------------Start hide and so pagination on click of button-----------*/ 
function hideshowpaging(obj)//
    {
        var chk = $(obj).attr('id');
        if(chk=='pgshow')
        {   
            $(obj).parents('.sp_div').attr('style','');
            $(obj).parents('.sp_div').find('table').children('tbody').find('tr').show();
            $(obj).parents('.sp_div').find('.tbldiv').css('height','650px');
            $(obj).parents('.sp_div').find('.spdpagination').hide();
            $(obj).attr('id','pghide').html('<i class="fas fa-eye" style="padding-right: 5px;"></i> show paging');
        }
        if(chk=='pghide')
        {
            updatepagination(obj); // call update pagination function
            $(obj).parents('.sp_div').find('.tbldiv').css('height','');
            $(obj).attr('id','pgshow').html('<i class="fas fa-eraser" style="padding-right: 5px;"></i> remove paging');
        }
    }
/*-------------End hide and show pagination ------------------*/ 

/*----------Go to function by taking input of go pagination show ----------*/ 
function gotopaging(obj) 
    {
        var checker = ($(obj).siblings('input').val())*1;
        
        if(typeof checker == 'number')
        {
            if(checker==0)
            {
                checker=1;
            }
        $(obj).attr('data-paging',(checker-1)); //set data of in variable
        updatepagination(obj); // than call upadate pagination to update it
        }
    }
/*End function */ 


/*---------------- Resized table column width ----------------------------*/ 
// this code of library used 
function resized()
{
	var tables = document.getElementsByTagName('table'); //get table
		for (var i=0; i<tables.length;i++)
		{
 			resizableGrid(tables[i]); //call this function in loop for multiple tables
		}

	function resizableGrid(table) 
	{	

		var row = table.getElementsByTagName('tr')[0], // get first row data
 
 		cols = row ? row.children : undefined;
 		if (!cols) return;
 
 		table.style.overflow = 'hidden';
 
 		var tableHeight = table.offsetHeight;

 
		for (var i=0;i<cols.length;i++){
            var div = createDiv(tableHeight);
            cols[i].appendChild(div);
            // cols[i].style.position = 'relative';
            setListeners(div);
        }

	    function setListeners(div){
            var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

            div.addEventListener('mousedown', function (e) {
            curCol = e.target.parentElement;
            nxtCol = curCol.nextElementSibling;
            pageX = e.pageX; 


            var padding = paddingDiff(curCol);

            curColWidth = curCol.offsetWidth - padding;
            if (nxtCol)
            nxtColWidth = nxtCol.offsetWidth - padding; 
            });

            div.addEventListener('mouseover', function (e) {
            e.target.style.borderRight = '2px solid #0000ff';
            })

            div.addEventListener('mouseout', function (e) {
            e.target.style.borderRight = '';
            })

            document.addEventListener('mousemove', function (e) {
            if (curCol) {
                var diffX = e.pageX - pageX;

            if (nxtCol)
            nxtCol.style.width = (nxtColWidth - (diffX))+'px';

            curCol.style.width = (curColWidth + diffX)+'px';
            $(curCol).css('word-wrap','anywhere');
            $(nxtCol).css('word-wrap','anywhere');

            }
            });

            document.addEventListener('mouseup', function (e) { 
            curCol = undefined;
            nxtCol = undefined;
            pageX = undefined;
            nxtColWidth = undefined;
            curColWidth = undefined
            });
		}
 
		function createDiv(height){
		var div = document.createElement('div');
		div.style.top = 0;
		div.style.right = 0;
		div.style.width = '5px';
		div.style.position = 'absolute';
		div.style.cursor = 'col-resize';
		div.style.userSelect = 'none';
		div.style.height = height + 'px';
		return div;
		}
 
		function paddingDiff(col){

		if (getStyleVal(col,'box-sizing') == 'border-box'){
		return 0;
		}

		var padLeft = getStyleVal(col,'padding-left');
		var padRight = getStyleVal(col,'padding-right');
		return (parseInt(padLeft) + parseInt(padRight));

		}

		function getStyleVal(elm,css){
		return (window.getComputedStyle(elm, null).getPropertyValue(css))
		}
	};
}   
/*-------------End resized columns-------------*/ 




/*-------------action on checkboxes show uniqe records number Like udi of rows-----------*/ 
function dlt_rcd_fn(obj)
{
	par 	= $(obj).parents('.sp_div').find('table');
	tbl 	= $(par).attr('class');
	inpts 	= 'singles_'+tbl;
	int_all = 'selectAll_'+tbl;

	fn_arr  = [];

		
		if($(par).find('.'+int_all).is(':checked')==true)
		{
			$(par).find('.'+inpts).each(function()
			{
				fn_arr.push($(this).val());
			});
		}
		else
		{
			$(par).find('.'+inpts).each(function(){
				if($(this).is(':checked')==true)
				{
					fn_arr.push($(this).val());
				}
				
			});
		}
	

	console.log(fn_arr);
}
/*end data of checkbox actions*/ 










/*------------Code of library used for show selected cell of tables-------------*/ 
var table = $("#demo");    

var isMouseDown         = false;
var startRowIndex       = null;
var startCellIndex      = null;


function selectTo(cell) {
    
    var row = cell.parent();    
    var cellIndex = cell.index();
    var rowIndex = row.index();
    // alert(rowIndex+'startRowIndex'+startRowIndex);
    var rowStart, rowEnd, cellStart, cellEnd;
    
    if (rowIndex < startRowIndex) {
        rowStart = rowIndex;
        rowEnd = startRowIndex;
    } else {
        rowStart = startRowIndex;
        rowEnd = rowIndex;
    }
    
    if (cellIndex < startCellIndex) {
        cellStart = cellIndex;
        cellEnd = startCellIndex;
    } else {
        cellStart = startCellIndex;
        cellEnd = cellIndex;
    }        
    
    for (var i = rowStart; i <= rowEnd; i++) {
        var rowCells = table.find("tr").eq(i+1).find("td");
        // alert(rowCells);
        for (var j = cellStart; j <= cellEnd; j++) {
            rowCells.eq(j).addClass("selected");
        }        
    }
}

function tdselectorn(){
table.find("td").mousedown(function (e) {
    $("footer").text("excel ");
    isMouseDown = true;
    var cell = $(this);

    table.find(".selected").removeClass("selected"); // deselect everything
    
    if (e.shiftKey) {
        selectTo(cell);                
    } else {
        cell.addClass("selected");
        startCellIndex = cell.index();
        startRowIndex = cell.parent().index();
    }
    
    return false; // prevent text selection
})
.mouseover(function () {
    if (!isMouseDown) return;
    table.find(".selected").removeClass("selected");
    selectTo($(this));
})
.bind("selectstart", function () {
    return false;
});

$('td').mouseup(function () {

    isMouseDown = false;
    tdselector();
});
}

function tdselector()
{
    var rows  = cols=   sum = 0;
   
    var arrys               = new Array();
    table.find('.selected').each(function()
                    {
                        arrys.push($(this).text());
                    });
    // console.log(arrys);
    var len = (arrys).length;

    if(len>1)
    {
     // $(".tdselected").css("background","aquamarine");
     for(i=0;i<len;i++)
     {
      if($.isNumeric(arrys[i]))
             {
                 sum += parseFloat(arrys[i]*1);
             }  
     }
 }
 arrys = [];
 $("footer").append(" count:"+len+ " Sum:"+sum);
}


/*-----------End table cell selection-----------*/ 



/*--------action update---------*/ 
	function actionUpd(obj) // update action checkbox in table
	{
        if(obj!==null)
        {
           var chk =  $(obj).parents('.sp_div').find('#spd_action').val(); // get action validation value store in hidden field
    		if(chk=='checkhide')
            {
            $('.checkhide').css('display','');
            }
    		$('.checkshow').hide();
        }
	}
/*------end action update---------*/ 


/*hide modal*/ 
$(document).mousedown(function(e)  // onclick 
{
    var container = $(".modal-content");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) 
    {
        $(".modal").fadeOut(400);
    }
});




/*----------download in excel csv file------------*/ 
function DownloadJSON2CSV(obj)
{
    var files   = $(obj).parents('.sp_div').children('.tbldiv').find('.filename').val(); // get table name    
    var cols    = $(obj).parents('.sp_div').children('.tbldiv').find('#tb_cols').val(); // table columns 
    var cause   = $.base64.encode($(obj).parents('.sp_div').children('.tbldiv').find('#cause').val()); // condition to apply on query
    

    $.ajax({

        type : "POST", 
        url  : "spd_ajax.php",
        data : {task:'download',tb_name:files, cols:cols, cond:cause},
            success:function(rtn)
                        {
                            
                            var arrData = $.parseJSON(rtn);                          
    
                            var CSV = '';    
   
                            //1st loop is to extract each row
                            for (var i = 0; i < arrData.length; i++) 
                            {
                                var row = "";
            
                                //2nd loop will extract each column and convert it in string comma-seprated
                                for (var index in arrData[i]) 
                                {
                                    row += '"' + arrData[i][index] + '",';
                                }

                                row.slice(0, row.length - 1);
            
                                //add a line break after each row
                                CSV += row + '\r\n';
                            }

                            if (CSV == '') 
                            {        
                                alert("Invalid data");
                                return;
                            }   
    
                        //Generate a file name
                        var fileName = "MyReport_";
                        //this will remove the blank-spaces from the title and replace it with an underscore
                        // fileName += ReportTitle.replace(/ /g,"_");   
    
                        //Initialize file format you want csv or xls
                        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    
                        // Now the little tricky part.
                        // you can use either>> window.open(uri);
                        // but this will not work in some browsers
                        // or you will not get the correct file extension    
                                        
                        //this trick will generate a temp <a /> tag
                        var link = document.createElement("a");    
                        link.href = uri;

                        //set the visibility hidden so it will not effect on your web-layout
                        link.style = "visibility:hidden";
                        link.download = fileName + ".csv";

                        //this part will append the anchor tag and remove it after automatic click
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                           
                            // window.open( "data:text/csv;charset=utf-8," + encodeURIComponent(arr_data));
                        }

                        });

    
    
}