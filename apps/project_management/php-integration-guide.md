# React + PHP Backend Integration Guide

## Overview
This document outlines how to integrate the AI Project Manager React frontend with a PHP backend to create a complete project management system with LLM processing capabilities.

## System Architecture

### Frontend (React)
- **Technology**: React.js with vanilla JavaScript (current implementation)
- **Responsibilities**: 
  - User interface and form handling
  - Client-side validation
  - Data collection and display
  - API communication with PHP backend

### Backend (PHP)
- **Technology**: PHP with MySQL database
- **Responsibilities**:
  - API endpoints for project data
  - LLM integration (OpenAI GPT, Claude, etc.)
  - Database operations
  - Authentication and session management

## API Endpoints Structure

### Project Management Endpoints

```php
// POST /api/projects
// Create new project
{
    "name": "Project Name",
    "type": "Software Development", 
    "description": "Project description",
    "timeline": "3-6 months",
    "stakeholders": [...],
    "objectives": [...],
    "budget": "$50K - $100K"
}

// GET /api/projects/{id}
// Retrieve project details

// PUT /api/projects/{id}
// Update project information

// DELETE /api/projects/{id}
// Delete project
```

### LLM Processing Endpoints

```php
// POST /api/projects/{id}/generate-charter
// Generate project charter using LLM

// POST /api/projects/{id}/assess-risks
// Generate risk assessment

// POST /api/projects/{id}/create-timeline
// Generate project timeline

// POST /api/projects/{id}/analyze-stakeholders
// Perform stakeholder analysis
```

## PHP Backend Implementation

### 1. Project Controller (projects.php)

```php
<?php
class ProjectController {
    private $db;
    private $llm;
    
    public function __construct($database, $llmService) {
        $this->db = $database;
        $this->llm = $llmService;
    }
    
    public function createProject($data) {
        // Validate input data
        $errors = $this->validateProjectData($data);
        if (!empty($errors)) {
            return $this->jsonResponse(['errors' => $errors], 400);
        }
        
        // Insert into database
        $projectId = $this->db->insertProject($data);
        
        return $this->jsonResponse(['id' => $projectId, 'message' => 'Project created successfully']);
    }
    
    public function generateCharter($projectId) {
        // Fetch project data
        $project = $this->db->getProject($projectId);
        
        // Build LLM prompt
        $prompt = $this->buildCharterPrompt($project);
        
        // Call LLM API
        $charter = $this->llm->generateText($prompt);
        
        // Save to database
        $this->db->saveProjectCharter($projectId, $charter);
        
        return $this->jsonResponse(['charter' => $charter]);
    }
    
    private function buildCharterPrompt($project) {
        return "Based on the project details provided: {$project['name']} ({$project['type']}), 
                with objectives: {$project['objectives']}, timeline: {$project['timeline']}, 
                and stakeholders: " . implode(', ', $project['stakeholders']) . 
                ", create a comprehensive project charter including purpose, scope, 
                deliverables, success criteria, assumptions, and constraints.";
    }
}
```

### 2. LLM Service Integration

```php
<?php
class LLMService {
    private $apiKey;
    private $apiUrl;
    
    public function __construct($apiKey) {
        $this->apiKey = $apiKey;
        $this->apiUrl = 'https://api.openai.com/v1/chat/completions';
    }
    
    public function generateText($prompt, $model = 'gpt-4') {
        $data = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => 'You are an expert project manager assistant.'],
                ['role' => 'user', 'content' => $prompt]
            ],
            'max_tokens' => 2000,
            'temperature' => 0.7
        ];
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->apiUrl);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        return $result['choices'][0]['message']['content'] ?? 'Error generating response';
    }
}
```

### 3. Database Schema

```sql
-- Projects table
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    timeline VARCHAR(50),
    budget VARCHAR(50),
    status VARCHAR(50) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stakeholders table
CREATE TABLE stakeholders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    role VARCHAR(255),
    email VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Project outputs table
CREATE TABLE project_outputs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    type ENUM('charter', 'risk_assessment', 'timeline', 'stakeholder_analysis'),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

## Frontend Integration Points

### 1. API Service Layer

```javascript
// Add to React app
class APIService {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
    }
    
    async createProject(projectData) {
        const response = await fetch(`${this.baseURL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(projectData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        
        return response.json();
    }
    
    async generateCharter(projectId) {
        const response = await fetch(`${this.baseURL}/projects/${projectId}/generate-charter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        return response.json();
    }
}
```

### 2. Replace Mock Functions

Replace the mock functions in the current React app:

```javascript
// Replace this mock function
async mockLLMProcess() {
    // Current mock implementation
}

// With real API calls
async processWithLLM() {
    const api = new APIService();
    
    try {
        // Create project
        const project = await api.createProject(this.projectData);
        this.projectId = project.id;
        
        // Generate outputs
        const charter = await api.generateCharter(this.projectId);
        const risks = await api.assessRisks(this.projectId);
        const timeline = await api.createTimeline(this.projectId);
        
        return { charter, risks, timeline };
    } catch (error) {
        console.error('LLM processing failed:', error);
        throw error;
    }
}
```

## Predefined Prompt Templates

### 1. Project Charter Generation
```
Based on the project details provided: {{projectName}} ({{projectType}}), 
with objectives: {{objectives}}, timeline: {{timeline}}, and stakeholders: {{stakeholders}}, 
create a comprehensive project charter including:

1. Project Purpose and Justification
2. Project Scope (In-scope and Out-of-scope items)  
3. Key Deliverables
4. Success Criteria and Acceptance Criteria
5. Key Assumptions
6. Major Constraints
7. High-level Timeline and Milestones
8. Budget Summary
9. Key Stakeholders and Roles
10. Project Risks and Mitigation Strategies

Format the response as a structured document with clear headings and bullet points.
```

### 2. Risk Assessment
```
Analyze the following project for potential risks:
- Project Type: {{projectType}}
- Budget: {{budget}}
- Timeline: {{timeline}}
- Team Size: {{teamSize}}
- Key Deliverables: {{deliverables}}

Identify the top 10 potential risks and for each risk provide:
1. Risk Description
2. Category (Technical, Financial, Timeline, Resource, Market, Regulatory, Communication)
3. Probability (Low/Medium/High)
4. Impact (Low/Medium/High)
5. Risk Score (Probability × Impact)
6. Mitigation Strategy
7. Contingency Plan

Format as a risk register table.
```

### 3. Timeline Planning
```
Create a detailed project timeline for {{projectName}} with the following parameters:
- Duration: {{timeline}}
- Key Deliverables: {{deliverables}}
- Team Size: {{teamSize}}
- Dependencies: {{dependencies}}

Include:
1. Project phases and major milestones
2. Task breakdown with estimated durations
3. Dependencies between tasks
4. Critical path identification
5. Buffer time recommendations
6. Key decision points and reviews
7. Resource allocation timeline

Present as a Gantt chart structure with phases, tasks, durations, and dependencies clearly marked.
```

## Security Considerations

1. **API Authentication**: Implement JWT or session-based authentication
2. **Input Validation**: Sanitize all user inputs before processing
3. **Rate Limiting**: Prevent API abuse with rate limiting
4. **CORS Configuration**: Properly configure CORS for React frontend
5. **LLM API Key Security**: Store API keys securely, use environment variables
6. **SQL Injection Prevention**: Use prepared statements
7. **XSS Protection**: Sanitize output data

## Deployment Architecture

```
[React Frontend] → [nginx/Apache] → [PHP Backend] → [MySQL Database]
                                                  → [LLM API (OpenAI/Claude)]
```

## Next Steps

1. Set up PHP development environment
2. Implement the API endpoints
3. Integrate LLM service
4. Set up database schema
5. Configure CORS and authentication
6. Update React frontend to use real APIs
7. Deploy and test the complete system

This architecture provides a scalable foundation for an AI-powered project management tool with comprehensive LLM integration capabilities.