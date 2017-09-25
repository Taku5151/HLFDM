<?php

include "global.php";

ConnectDB();

$sql = "UPDATE _savedqueries SET Query = '";

$sql .= CleanSQL($_POST["query"]) . "' WHERE `ID`=";
$sql .= $_POST["ID"];

if(mysqli_query($dc, $sql)){
    echo 'success';
} else {
    echo $sql;
}
