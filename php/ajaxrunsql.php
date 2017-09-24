<?php

include "global.php";

ConnectDB();

$sql = "SELECT * FROM testtable;";

$result = mysqli_query($dc, $sql);

if (!$result)
{
  $message = 'ERROR:' . mysqli_error();
  return $message;
}

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$output = "[";

$fieldnames = "{";
$fieldtypes = "{";

$fieldnamesarray = array();
$fieldtypesarray = array();

$i = 0;
$rowcount = mysqli_num_fields($result);

while ($info = $result->fetch_field()) {
  if ($i != 0) {
    $fieldnames.= ",";
    $fieldtypes.= ",";
  }

  $fieldnames .= '"field' . $i . '":"' . $info->name . '"';
  $fieldtypes .= '"field' . $i . '":"' . $info->type. '"';

  array_push($fieldnamesarray, $info->name);
  array_push($fieldtypesarray, $info->type);

  $i++;
}

$output .= $fieldnames . "}," . $fieldtypes . "}";

while ($row = mysqli_fetch_array($result)) {
  if ($output != "[")
    $output .= ",";

  $i = 0;
  $output.= "{";

  while($i < $rowcount) {
    if($i != 0)
      $output.= ",";

    $output.= '"'. $fieldnamesarray[$i] .'":';

    switch ($fieldtypesarray[$i]) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 8:
    case 9:
    case 13:
    case 16:
    case 246:
      $output.= $row[$i];
      break;
    case 7:
    case 10:
    case 11:
    case 12:
    case 252:
    case 253:
    case 254:
    default:
      $output.= '"' . $row[$i] . '"';
      break;
      }
    $i++;
  }
  $output.="}";
}
$output .="]";

echo($output);

mysqli_close($dc);
