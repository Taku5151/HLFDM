<?php

include "global.php";

ConnectDB();

$sql = "INSERT INTO _savedqueries (Name, Query) VALUES ('";

$sql .= CleanSQL($_POST["name"]) . "', '";
$sql .= CleanSQL($_POST["query"]) . "')";

if(mysqli_query($dc, $sql)){
    echo 'success';
} else {
    echo $sql;
}
