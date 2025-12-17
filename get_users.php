<?php
header('Content-Type: application/json');

// Read the users.json file
$usersFile = 'users.json';
if(!file_exists($usersFile)){
    // If the file doesn't exist, create it with empty arrays
    $emptyData = ['pending'=>[], 'approved'=>[]];
    file_put_contents($usersFile, json_encode($emptyData, JSON_PRETTY_PRINT));
}

$data = json_decode(file_get_contents($usersFile), true);

// Send JSON data to frontend
echo json_encode($data);
?>
