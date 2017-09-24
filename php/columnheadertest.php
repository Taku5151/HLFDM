<?php

$datahost = "127.0.0.1";
// $datahost = "localhost";
$datauser = "root";
$datapw = "";
$datadb = "test";
$dc;

$host = '127.0.0.1';
$server = $host . ':' . $port;
$user = 'root';
$password = '';

$dc = mysqli_connect($datahost, $datauser, $datapw, $datadb);
if (!$dc)
{
	die('Error: Could not connect: ' . mysqli_connect_error());
}

$sql = 'SELECT * FROM testtable';

$result = mysqli_query($dc, $sql);

if (!$result)
{
	$message = 'ERROR:' . mysql_error();
	return $message;
}
else
{
	$i = 0;
	echo '<html><body><table><tr>';
	while ($i < mysql_num_fields($result))
	{
		$meta = mysql_fetch_field($result, $i);
		echo '<td>' . $meta->name . '</td>';
		$i = $i + 1;
	}
	echo '</tr>';

	$i = 0;
	while ($row = mysql_fetch_row($result))
	{
		echo '<tr>';
		$count = count($row);
		$y = 0;
		while ($y < $count)
		{
			$c_row = current($row);
			echo '<td>' . $c_row . '</td>';
			next($row);
			$y = $y + 1;
		}
		echo '</tr>';
		$i = $i + 1;
	}
	echo '</table></body></html>';
	mysql_free_result($result);
}

mysql_close ($link);
?>
