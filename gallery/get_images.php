<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$portraitsDir = 'portraits/';
$imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

$images = [];

if (is_dir($portraitsDir)) {
    $files = scandir($portraitsDir);
    
    foreach ($files as $file) {
        if ($file === '.' || $file === '..') {
            continue;
        }
        
        $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
        if (in_array($extension, $imageExtensions)) {
            $images[] = $file;
        }
    }
    
    // Sort images alphabetically
    sort($images);
}

echo json_encode($images);
?>
