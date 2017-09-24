<?php

//Return queries

include "global.php";

ConnectDB();

$sql = "select * from _savedqueries;";

$result = mysqli_query($dc, $sql);

if (!$result)
{
  $message = 'SQL ERROR: ' . mysqli_error($dc);
  echo $message;
  return;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$output = "[";

while ($row = mysqli_fetch_array($result)) {
  if($output != "[")
    $output .= ",";

    $output .= '"{ID":' . $row[0] . ',';
    $output .= '"Name":"' . $row[1] . '",';
    $output .= '"Color":"' . $row[2] . '",';
    $output .= '"Order":' . $row[3] . ',';
    $output .= '"Query":"' . $row[4] . '"}';
}
$output .="]";

echo($output);

mysqli_close($dc);
