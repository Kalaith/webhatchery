<?php
// Stories Index - Displays excerpts from all story folders
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Story Collection</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2c3e50;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 2rem 0;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .main-header {
            text-align: center;
            margin-bottom: 3rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 3rem 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .main-header h1 {
            font-size: 3rem;
            color: #8e44ad;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .main-header .subtitle {
            font-size: 1.3rem;
            color: #7d3c98;
            font-style: italic;
        }

        .story-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .story-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .story-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .story-header {
            background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
            padding: 1.5rem;
            border-bottom: 3px solid #e0b4d6;
        }

        .story-title {
            font-size: 1.5rem;
            color: #8e44ad;
            margin-bottom: 0.5rem;
            text-transform: capitalize;
        }

        .story-excerpt {
            padding: 1.5rem;
            min-height: 200px;
        }

        .no-excerpt {
            color: #7f8c8d;
            font-style: italic;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .story-link {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: all 0.3s ease;
            font-weight: bold;
        }

        .story-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .error-message {
            background: #e74c3c;
            color: white;
            padding: 1rem;
            border-radius: 10px;
            margin: 1rem 0;
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 1rem;
            }
            
            .main-header h1 {
                font-size: 2rem;
            }
            
            .story-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="main-header">
            <h1>Story Collection</h1>
            <div class="subtitle">A curated collection of tales and adventures</div>
        </div>

        <div class="story-grid">
            <?php
            $currentDir = __DIR__;
            
            // Get all directories in the current folder
            $directories = array_filter(glob($currentDir . '/*'), 'is_dir');
            
            if (empty($directories)) {
                echo '<div class="error-message">No story directories found.</div>';
            } else {                foreach ($directories as $dir) {
                    $dirName = basename($dir);
                    
                    // Skip hidden directories and files
                    if (substr($dirName, 0, 1) === '.') {
                        continue;
                    }
                    
                    $excerptFile = $dir . '/excerpt.html';
                    $indexFile = $dir . '/index.html';
                    
                    // Extract title from index.html if it exists
                    $storyTitle = ucwords(str_replace(['_', '-'], ' ', $dirName)); // fallback title
                    if (file_exists($indexFile)) {
                        $htmlContent = file_get_contents($indexFile);
                        if (preg_match('/<title[^>]*>(.*?)<\/title>/i', $htmlContent, $matches)) {
                            $storyTitle = trim($matches[1]);
                        } elseif (preg_match('/<h1[^>]*>(.*?)<\/h1>/i', $htmlContent, $matches)) {
                            // If no title tag, try to get the first h1
                            $storyTitle = trim(strip_tags($matches[1]));
                        }
                    }
                    
                    echo '<div class="story-card">';
                    echo '<div class="story-header">';
                    echo '<h2 class="story-title">' . htmlspecialchars($storyTitle) . '</h2>';
                    echo '</div>';
                    
                    echo '<div class="story-excerpt">';
                    
                    if (file_exists($excerptFile)) {
                        // Include the excerpt file
                        include $excerptFile;
                    } else {
                        echo '<div class="no-excerpt">';
                        echo '<p>No excerpt available for this story yet.</p>';
                        echo '<p><em>Excerpt file not found: excerpt.html</em></p>';
                        echo '</div>';
                    }
                    
                    // Add link to the full story if index.html exists
                    if (file_exists($indexFile)) {
                        echo '<a href="' . htmlspecialchars($dirName) . '/index.html" class="story-link">Read Full Story</a>';
                    } else {
                        echo '<div style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">Story file not found</div>';
                    }
                    
                    echo '</div>'; // Close story-excerpt
                    echo '</div>'; // Close story-card
                }
            }
            ?>
        </div>
    </div>
</body>
</html>
