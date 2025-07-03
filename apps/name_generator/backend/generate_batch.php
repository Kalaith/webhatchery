<?php
header('Content-Type: application/json');
$count = intval($_GET['count'] ?? 1);
$types = isset($_GET['types']) ? (array)$_GET['types'] : ['people'];

// TODO: Replace with real generation logic
$mock = [
    'people' => ['Alice Smith', 'Bob Johnson'],
    'places' => ['Northwind Valley', 'Crimson Falls'],
    'events' => ['Summit of Innovation', 'Harmony Festival'],
    'titles' => ['The Quantum Paradox', 'Whispers in the Wind']
];

$results = [];
foreach ($types as $type) {
    $results[$type] = array_slice($mock[$type] ?? [], 0, $count);
}
echo json_encode($results); 