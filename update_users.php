<?php
header('Content-Type: application/json');

// Path to the users.json file
$usersFile = 'users.json';

// Make sure users.json exists
if(!file_exists($usersFile)){
    $emptyData = ['pending'=>[], 'approved'=>[]];
    file_put_contents($usersFile, json_encode($emptyData, JSON_PRETTY_PRINT));
}

// Read the existing users
$data = json_decode(file_get_contents($usersFile), true);

// Read input JSON from frontend
$input = json_decode(file_get_contents('php://input'), true);

// Add a new payment request
if(isset($input['action']) && $input['action'] === 'add'){
    $name = trim($input['user']['name']);
    $phone = trim($input['user']['phone']);
    $time = $input['user']['time'];

    // Avoid duplicate pending submissions
    $existsPending = false;
    foreach($data['pending'] as $u){
        if($u['phone'] === $phone){
            $existsPending = true;
            break;
        }
    }

    if(!$existsPending){
        $data['pending'][] = ['name'=>$name, 'phone'=>$phone, 'time'=>$time];
        file_put_contents($usersFile, json_encode($data, JSON_PRETTY_PRINT));
        echo json_encode(['status'=>'added', 'message'=>'Payment request submitted!']);
    } else {
        echo json_encode(['status'=>'exists', 'message'=>'You already submitted payment request.']);
    }
}

// Approve a user
if(isset($input['action']) && $input['action'] === 'approve'){
    $phone = $input['phone'];
    foreach($data['pending'] as $k => $u){
        if($u['phone'] === $phone){
            // Set 30-day expiry from now
            $expiry = date('c', strtotime('+30 days'));
            $data['approved'][] = ['name'=>$u['name'], 'phone'=>$u['phone'], 'accessExpiry'=>$expiry];
            // Remove from pending
            unset($data['pending'][$k]);
            $data['pending'] = array_values($data['pending']); // reindex
            file_put_contents($usersFile, json_encode($data, JSON_PRETTY_PRINT));
            echo json_encode(['status'=>'approved', 'message'=>'User approved!']);
            exit;
        }
    }
    echo json_encode(['status'=>'notfound', 'message'=>'User not found in pending list.']);
}
?>
