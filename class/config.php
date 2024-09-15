<?php /*
====================================================================================================
Application Name: SPD
====================================================================================================
          Module: Connection
       File Name: Config.php
          Author: Ashish vishwakarma
    Created Date: 03- May - 2019
   Modified Date:
     Description:
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
class config{ 	// Database Connection

	public $conn;									
	private $servername 	= "localhost";			// Server Name
	private $db_name 		= "spreadsheet";	// Database Name
	private $username 		= "root";	// Username	
	private $password 		= ""; // Password
	
	public function connect($conn_type = 'MYSQLI'){		
		if(strtoupper($conn_type) == 'PDO'){
			//echo "mysql:host=$this->servername;dbname=$this->db_name";	
			$this->conn 	= new PDO("mysql:host=$this->servername;dbname=$this->db_name", $this->username, $this->password);
			$this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		} else if(strtoupper($conn_type) == 'MYSQLI') {
			return $this->conn 	= mysqli_connect($this->servername,$this->username,$this->password,$this->db_name);
		} else if(strtoupper($conn_type) == 'MYSQL') {			
			$this->conn	= mysql_connect($this->servername,$this->username,$this->password);
			if($this->conn){
				//$conn_type."-".$this->servername."-".$this->username."-".$this->password;
				$this->selectDB($this->db_name,$this->conn); 
			}		
		}
		// return $conn;
	}
	
	
	public function selectDB($db_name,$conn){
 		return mysql_select_db($db_name,$conn);
	}

	public function close($conn_type = 'MYSQLI'){ 
 		if(strtoupper($conn_type) == 'MYSQLI') {
			return $this->conn 	=  mysqli_close($this->conn);
		}
		else if(strtoupper($conn_type) == 'MYSQL') {
			$this->conn = mysql_close($this->conn);
		}
	}
}
$conf	=	new config();
?>