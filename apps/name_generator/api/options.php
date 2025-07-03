<?php
header('Content-Type: application/json');

$options = [
    'gender' => [
        ['value' => 'any', 'label' => 'Any'],
        ['value' => 'male', 'label' => 'Male'],
        ['value' => 'female', 'label' => 'Female'],
    ],
    'culture' => [
        ['value' => 'any', 'label' => 'Any'],
        ['value' => 'western', 'label' => 'Western'],
        ['value' => 'nordic', 'label' => 'Nordic'],
        ['value' => 'eastern', 'label' => 'Eastern'],
    ],
    'method' => [
        ['value' => 'markov_chain', 'label' => 'Markov Chain'],
        ['value' => 'syllable_based', 'label' => 'Syllable Based'],
        ['value' => 'phonetic_pattern', 'label' => 'Phonetic Pattern'],
        ['value' => 'historical_pattern', 'label' => 'Historical Pattern'],
        ['value' => 'fantasy_generated', 'label' => 'Fantasy Generated'],
    ],
    'type' => [
        ['value' => 'full_name', 'label' => 'Full Name'],
        ['value' => 'first_only', 'label' => 'First Only'],
        ['value' => 'last_only', 'label' => 'Last Only'],
        ['value' => 'nickname', 'label' => 'Nickname'],
        ['value' => 'formal', 'label' => 'Formal'],
    ],
    'period' => [
        ['value' => 'modern', 'label' => 'Modern'],
        ['value' => 'medieval', 'label' => 'Medieval'],
        ['value' => 'ancient', 'label' => 'Ancient'],
    ]
];

$field = $_GET['field'] ?? null;
if (!$field || !isset($options[$field])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing field parameter']);
    exit;
}

echo json_encode($options[$field]); 