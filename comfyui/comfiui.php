<?php
// ComfyUI Redirect to ngrok hosted service
$comfyuiUrl = 'https://awaited-grouper-talented.ngrok-free.app';

// Get the request path
$path = $_SERVER['REQUEST_URI'];

// Remove /comyui.php from the path if it exists
$path = str_replace('/comyui.php', '', $path);

// Build the target URL
$targetUrl = rtrim($comfyuiUrl, '/') . $path;

// Add query string if it exists
if (!empty($_SERVER['QUERY_STRING'])) {
    $targetUrl .= '?' . $_SERVER['QUERY_STRING'];
}

// Redirect to the ngrok URL
header("Location: $targetUrl", true, 302);
exit;
?>
