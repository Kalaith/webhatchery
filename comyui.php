<?php
// IP of your desktop and the port
$remoteHost = 'http://100.67.158.101:8188/';

// Forward original request URI
$path = $_SERVER['REQUEST_URI'];
$targetUrl = $remoteHost . $path;

// Initialize cURL
$ch = curl_init($targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, false);

// Optionally forward request headers
$headers = [];
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) !== 'host') {
        $headers[] = "$name: $value";
    }
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Get response
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

// Return response
http_response_code($httpCode);
if ($contentType) {
    header("Content-Type: $contentType");
}
echo $response;
