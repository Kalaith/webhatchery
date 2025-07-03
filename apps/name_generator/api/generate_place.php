<?php
header('Content-Type: application/json');
require_once 'generators.php';

$type = $_GET['type'] ?? 'city';
$style = $_GET['style'] ?? 'english';
$method = $_GET['method'] ?? 'traditional_pattern';
$count = intval($_GET['count'] ?? 1);

$generators = new NameGenerators();
$names = [];
for ($i = 0; $i < $count; $i++) {
    $names[] = $generators->generatePlaceName($type, $style, $method);
}
echo json_encode(['names' => $names]); 