<?php

use App\External\DatabaseService;
use App\Utils\Logger;
use App\Actions\ProjectActions;
use App\Controllers\ProjectController;

require __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Initialize services
try {
    $dbService = new DatabaseService();
    if (!$dbService->testConnection()) {
        throw new Exception('Could not connect to database.');
    }
    
    $logger = new Logger();
    $projectActions = new ProjectActions($logger);
    $projectController = new ProjectController($projectActions, $logger);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}

// Simple routing
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Extract path after /api/
if (preg_match('#/api/(.*)#', $path, $matches)) {
    $route = $matches[1];
} else {
    $route = '';
}

// Route handling
if ($route === 'status') {
    echo json_encode([
        'status' => 'OK',
        'service' => 'Is It Done Yet API - Simple PHP',
        'version' => '1.0.0'
    ]);
} elseif ($route === 'projects') {
    // Handle projects endpoint using existing controller
    if ($requestMethod === 'GET') {
        try {
            // Use the controller method that returns an array
            $result = $projectController->getAllProjects();
            echo json_encode($result);
            
        } catch (Exception $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } elseif ($requestMethod === 'POST') {
        try {
            // Get JSON data from request body
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                exit;
            }
            
            $result = $projectController->createProject($data);
            
            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} elseif (preg_match('#^projects/(\d+)$#', $route, $matches)) {
    // Handle individual project endpoints (GET, PUT, DELETE)
    $projectId = (int) $matches[1];
    
    if ($requestMethod === 'GET') {
        try {
            $result = $projectController->getProjectById($projectId);
            
            if (!$result['success']) {
                http_response_code(404);
            }
            
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } elseif ($requestMethod === 'PUT') {
        try {
            // Get JSON data from request body
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                exit;
            }
            
            $result = $projectController->updateProject($projectId, $data);
            
            if (!$result['success']) {
                http_response_code(404);
            }
            
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } elseif ($requestMethod === 'DELETE') {
        try {
            $result = $projectController->deleteProject($projectId);
            
            if (!$result['success']) {
                http_response_code(404);
            }
            
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} elseif (preg_match('#^projects/(\d+)/complete$#', $route, $matches)) {
    // Handle project completion endpoint (POST)
    $projectId = (int) $matches[1];
    
    if ($requestMethod === 'POST') {
        try {
            $result = $projectController->markProjectComplete($projectId);
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} elseif (preg_match('#^projects/(\d+)/subtasks$#', $route, $matches)) {
    // Handle subtask creation endpoint (POST)
    $projectId = (int) $matches[1];
    
    if ($requestMethod === 'POST') {
        try {
            // Get JSON data from request body
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid JSON data'
                ]);
                exit;
            }
            
            $result = $projectController->addSubtask($projectId, $data);
            
            if ($result['success']) {
                http_response_code(201);
            } else {
                http_response_code(400);
            }
            
            echo json_encode($result);
            
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} elseif ($route === 'test-db') {
    // Simple database test route
    try {
        $connection = $dbService::getConnection()->getConnection()->getPdo();
        $stmt = $connection->query('SELECT COUNT(*) as project_count FROM projects');
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'message' => 'Database connection working',
            'project_count' => $result['project_count'],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Route not found']);
}
?>
