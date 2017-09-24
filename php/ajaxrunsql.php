<?php

include "global.php";

ConnectDB();

$sql = "SELECT * FROM testtable;";

$result = mysqli_query($dc, $sql);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$output = "[";
while ($row = mysqli_fetch_array($result)) {
    if ($output != "[")
        $output .= ",";

    $output .= '{"First":' . $row["first"] . ',';
    $output .= '"Second":"' . $row["second"] . '",';
    $output .= '"Third":"' . $row["third"] . '",';
    $output .= '"Fourth":' . $row["fourth"] . '}';
}
$output .="]";

echo($output);

mysqli_close($dc);
