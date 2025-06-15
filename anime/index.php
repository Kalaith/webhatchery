<?php
// Stories Index - Displays excerpts from all story folders
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">    <title>Anime Character Collection</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #2c3e50;
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%);
            min-height: 100vh;
            padding: 2rem 0;
            position: relative;
            overflow-x: hidden;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(255, 107, 157, 0.1) 0%, transparent 50%);
            z-index: -1;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
        }        .main-header {
            text-align: center;
            margin-bottom: 3rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 25px;
            padding: 3rem 2rem;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .main-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255, 107, 157, 0.05) 0%, rgba(248, 181, 0, 0.05) 100%);
            z-index: -1;
        }

        .main-header h1 {
            font-size: 3.5rem;
            background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 30px rgba(255, 107, 157, 0.3);
            font-weight: bold;
            position: relative;
        }

        .main-header .subtitle {
            font-size: 1.4rem;
            color: #c44569;
            font-style: italic;
            font-weight: 500;
        }        .story-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
            gap: 2.5rem;
            margin-bottom: 2rem;
        }

        .story-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(15px);
            border-radius: 25px;
            box-shadow: 
                0 20px 40px rgba(0, 0, 0, 0.1),
                0 1px 0 rgba(255, 255, 255, 0.6) inset;
            overflow: hidden;
            transition: all 0.4s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
            position: relative;
        }
        
        .story-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(255, 107, 157, 0.03) 0%, rgba(248, 181, 0, 0.03) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 0;
        }

        .story-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 
                0 30px 60px rgba(255, 107, 157, 0.2),
                0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .story-card:hover::before {
            opacity: 1;
        }

        .story-header {
            background: linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%);
            padding: 2rem 1.5rem;
            border-bottom: 3px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 1;
        }

        .story-title {
            font-size: 1.6rem;
            color: #ffffff;
            margin-bottom: 0.5rem;
            text-transform: capitalize;
            font-weight: bold;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }        .story-excerpt {
            padding: 2rem 1.5rem;
            min-height: 200px;
            position: relative;
            z-index: 1;
            color: #2c3e50;
        }
        
        .story-excerpt * {
            color: #2c3e50 !important;
        }
        
        .story-excerpt p {
            color: #2c3e50 !important;
            margin-bottom: 1rem;
            line-height: 1.6;
        }
        
        .story-excerpt .highlight {
            color: #c44569 !important;
            font-weight: bold;
        }
        
        .story-excerpt .call-to-action {
            background: transparent !important;
            border: none !important;
            padding: 1rem 0 !important;
        }
        
        .story-excerpt .call-to-action p {
            color: #2c3e50 !important;
        }        .no-excerpt {
            color: #ffffff !important;
            font-style: italic;
            text-align: center;
            padding: 2rem;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            border-radius: 15px;
            margin: 1rem;
        }
        
        .no-excerpt p {
            color: #ffffff !important;
        }

        .story-link {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 1rem 2rem;
            background: linear-gradient(45deg, #ff6b9d, #c44569, #f8b500);
            color: white;
            text-decoration: none;
            border-radius: 30px;
            transition: all 0.3s ease;
            font-weight: bold;
            font-size: 1rem;
            box-shadow: 0 5px 15px rgba(255, 107, 157, 0.3);
            position: relative;
            overflow: hidden;
        }
        
        .story-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.6s ease;
        }

        .story-link:hover {
            transform: translateY(-3px);
            box-shadow: 
                0 15px 30px rgba(255, 107, 157, 0.4),
                0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        .story-link:hover::before {
            left: 100%;
        }        .error-message {
            background: linear-gradient(45deg, #ff6b9d, #c44569);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            margin: 1rem 0;
            box-shadow: 0 10px 20px rgba(255, 107, 157, 0.3);
            text-align: center;
            font-weight: bold;
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
    <div class="container">        <div class="main-header">
            <h1>Anime Character Collection</h1>
            <div class="subtitle">Explore legendary heroes, villains, and unforgettable personalities</div>
        </div>

        <div class="story-grid">
            <?php
            $currentDir = __DIR__;
            
            // Get all directories in the current folder
            $directories = array_filter(glob($currentDir . '/*'), 'is_dir');
              if (empty($directories)) {
                echo '<div class="error-message">No anime character directories found.</div>';
            } else {foreach ($directories as $dir) {
                    $dirName = basename($dir);
                    
                    // Skip hidden directories and files
                    if (substr($dirName, 0, 1) === '.') {
                        continue;
                    }
                    
                    $excerptFile = $dir . '/excerpt.html';
                    $indexFile = $dir . '/index.html';
                      // Extract title from index.html if it exists
                    $characterTitle = ucwords(str_replace(['_', '-'], ' ', $dirName)); // fallback title
                    if (file_exists($indexFile)) {
                        $htmlContent = file_get_contents($indexFile);
                        if (preg_match('/<title[^>]*>(.*?)<\/title>/i', $htmlContent, $matches)) {
                            $characterTitle = trim($matches[1]);
                        } elseif (preg_match('/<h1[^>]*>(.*?)<\/h1>/i', $htmlContent, $matches)) {
                            // If no title tag, try to get the first h1
                            $characterTitle = trim(strip_tags($matches[1]));
                        }
                    }
                    
                    echo '<div class="story-card">';
                    echo '<div class="story-header">';
                    echo '<h2 class="story-title">' . htmlspecialchars($characterTitle) . '</h2>';
                    echo '</div>';
                    
                    echo '<div class="story-excerpt">';
                    
                    if (file_exists($excerptFile)) {
                        // Include the excerpt file
                        include $excerptFile;
                    } else {
                        echo '<div class="no-excerpt">';
                        echo '<p>No character excerpt available yet.</p>';
                        echo '<p><em>Excerpt file not found: excerpt.html</em></p>';
                        echo '</div>';
                    }
                    
                    // Add link to the full character profile if index.html exists
                    if (file_exists($indexFile)) {
                        echo '<a href="' . htmlspecialchars($dirName) . '/index.html" class="story-link">View Character Profile</a>';
                    } else {
                        echo '<div style="margin-top: 1rem; color: #7f8c8d; font-style: italic;">Character profile not found</div>';
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
