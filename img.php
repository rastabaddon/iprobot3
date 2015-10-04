<?php

	$login = $_GET['usr']; 
	$pass = $_GET['pwd'];
	$ip = $_GET['ip'];
	$cam = $_GET['cam'];

date_default_timezone_set('UTC');


header("Content-Type: image/jpeg");

$recordFileTo = "";

$frameid = @file_get_contents("tmp/count-".$cam.".txt");
if(!$frameid) $frameid = 0;
$frameid++;
if($frameid>60)
{
	//do filmu
	if(file_exists('tmp/cam-'.$cam.'.mp4'))
	{
		system("ffmpeg -itsoffset 1 -y -an -r 5 -t 3 -f image2 -i tmp/cam-".$cam.".mp4 -i tmp/frame-".$cam."-%d.jpg tmp/cam-".$cam.".mp4");	
	} else {
		system("ffmpeg -itsoffset 1 -y -an -r 5 -t 3 -f image2 -i tmp/frame-".$cam."-%d.jpg tmp/cam-".$cam.".mp4");
	}
	$saveAs = "Storage/cam-".$cam."-".date('Y-m-d-H-i-s').".mp4";
	error_log('SAVE TO '.$saveAs);
	system("cp tmp/cam-".$cam.".mp4 ".$saveAs);
	
	$frameid=0;
}
file_put_contents("tmp/count-".$cam.".txt",$frameid);

// create a new cURL resource
$ch = curl_init();

if(!file_exists("tmp/lock.txt")) file_put_contents("tmp/lock.txt",'1');
$fp = fopen("tmp/lock.txt",'rw');
if (flock($fp, LOCK_EX)) {  // acquire an exclusive lock
    



$url = 'http://'.$ip.'/tmpfs/snap.jpg?usr='.$login.'&pwd='.$pass.'&r='.rand();
error_log($url);

// set URL and other appropriate options
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_HEADER, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; .NET CLR 1.1.4322)");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// grab URL and pass it to the browser
$data = curl_exec($ch);

//$image = new Imagick();
//$image->readimageblob($data);

error_log("SUCCESS");
file_put_contents("tmp/frame-".$cam."-".$frameid.".jpg",$data);
file_put_contents("fake.jpg",$data);
echo $data;
// close cURL resource, and free up system resources
curl_close($ch);

    flock($fp, LOCK_UN);    // release the lock
} else {
	echo file_get_contents("fake.jpg");
    //echo "Couldn't get the lock!";
}
