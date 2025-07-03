<?php

// Name Generator API
header('Content-Type: application/json');

require_once 'generators.php';

// Initialize the NameGenerators class
$generators = new NameGenerators();

// Get parameters from the request
$culture = $_GET['culture'] ?? 'western';
$gender = $_GET['gender'] ?? 'male';
$count = intval($_GET['count'] ?? 1);
$method = $_GET['method'] ?? 'markov_chain';
$period = $_GET['period'] ?? 'medieval'; // for historical

// Validate parameters
if (!isset($generators->markovChains[$culture]) && !isset($generators->syllableBanks[$culture]) && $method !== 'fantasy') {
    echo json_encode(['error' => 'Invalid culture']);
    exit;
}
if (!in_array($gender, ['male', 'female'])) {
    echo json_encode(['error' => 'Invalid gender']);
    exit;
}
if ($count < 1 || $count > 10) {
    echo json_encode(['error' => 'Count must be between 1 and 10']);
    exit;
}

$names = [];
for ($i = 0; $i < $count; $i++) {
    switch ($method) {
        case 'markov_chain':
            $names[] = $generators->generateMarkovName($culture, $gender);
            break;
        case 'syllable':
            $names[] = $generators->generateSyllableName($culture);
            break;
        case 'phonetic':
            $names[] = $generators->generatePhoneticName($culture, $gender);
            break;
        case 'historical':
            $names[] = $generators->generateHistoricalName($culture, $period, $gender);
            break;
        case 'fantasy':
            $names[] = $generators->generateSyllableName('fantasy');
            break;
        default:
            echo json_encode(['error' => 'Invalid method']);
            exit;
    }
}

// Return names as JSON
echo json_encode(['names' => $names]);

?>
