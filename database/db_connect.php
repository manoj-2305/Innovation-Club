<?php
$host = "b0g0kmwxuwig2qxqxi6e-mysql.services.clever-cloud.com";  // From Clever Cloud
$username = "uyqe0f9pljhjbl24"; 
$password = "I4cu3maPECbguecKHcwf"; 
$database = "b0g0kmwxuwig2qxqxi6e"; 
$port = "3306";

$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully!";
?>

