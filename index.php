<?php
$projectsJson = file_get_contents('projects.json');
$data = json_decode($projectsJson, true);

// Function to get deployment type badge
function getDeploymentBadge($project) {
    if (!isset($project['deployment'])) return '';
    
    $type = $project['deployment']['type'];
    $badges = [
        'Static' => '<span class="badge badge-static">Static</span>',
        'React' => '<span class="badge badge-react">React</span>',
        'FullStack' => '<span class="badge badge-fullstack">Full Stack</span>',
        'PHP' => '<span class="badge badge-php">PHP</span>'
    ];
    
    return $badges[$type] ?? '<span class="badge badge-other">' . htmlspecialchars($type) . '</span>';
}

// Function to get project URL based on deployment config
function getProjectUrl($project) {
    if (isset($project['deployment']['deployAs'])) {
        return $project['deployment']['deployAs'] . '/';
    }
    return $project['path'];
}

// Function to get GitHub repository link
function getGitHubLink($project) {
    if (isset($project['repository']['url'])) {
        return '<a href="' . htmlspecialchars($project['repository']['url']) . '" class="github-link" target="_blank" rel="noopener" title="View on GitHub">
                  <svg class="github-icon" viewBox="0 0 16 16" width="16" height="16">
                    <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  GitHub
                </a>';
    }
    return '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WebHatchery.au</title>
  <link rel="stylesheet" href="index.css" />
  <meta name="description" content="<?php echo htmlspecialchars($data['description'] ?? 'WebHatchery - Where ideas hatch into websites'); ?>">
</head>
<body>
  <div class="container">    <header>
      <h1>Welcome to WebHatchery.au</h1>
      <p class="tagline">Where ideas hatch into websites.</p>
      <p class="description"><?php echo htmlspecialchars($data['description'] ?? 'This is a development landing page for web experiments, game previews, and digital prototypes.'); ?></p>
      <?php if (isset($data['version'])): ?>
        <p class="version">Platform Version: <?php echo htmlspecialchars($data['version']); ?></p>
      <?php endif; ?>
      
      <?php if (isset($data['global']['repository'])): ?>
        <div class="main-repository">
          <a href="<?php echo htmlspecialchars($data['global']['repository']['url']); ?>" 
             class="main-github-link" 
             target="_blank" 
             rel="noopener"
             title="View <?php echo htmlspecialchars($data['global']['repository']['name']); ?> on GitHub">
            <svg class="github-icon" viewBox="0 0 16 16" width="20" height="20">
              <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            <span>View on GitHub</span>
          </a>
        </div>
      <?php endif; ?>
    </header>
      <nav class="quick-links">
      <h2>Quick Access</h2>
      <div class="links">
        <?php foreach ($data['groups'] as $groupId => $group): ?>
          <div class="link-group">
            <h3><?php echo htmlspecialchars($group['name']); ?></h3>
            <div class="link-items">
              <?php foreach ($group['projects'] as $project): ?>
                <a href="<?php echo htmlspecialchars(getProjectUrl($project)); ?>" 
                   class="project-link">
                  <?php echo htmlspecialchars($project['title']); ?>
                </a>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    </nav>
      <main class="project-showcase">
      <h2>Project Portfolio</h2>
      <?php foreach ($data['groups'] as $groupId => $group): ?>
        <section class="group" id="<?php echo htmlspecialchars($groupId); ?>">
          <h3><?php echo htmlspecialchars($group['name']); ?></h3>
          <div class="project-grid">
            <?php foreach ($group['projects'] as $project): ?>
              <article class="project-card">                <header class="project-header">
                  <h4>
                    <a href="<?php echo htmlspecialchars(getProjectUrl($project)); ?>">
                      <?php echo htmlspecialchars($project['title']); ?>
                    </a>
                  </h4>
                  <div class="project-meta">
                    <?php echo getDeploymentBadge($project); ?>
                    <?php if (isset($project['deployment']['requiresBuild']) && $project['deployment']['requiresBuild']): ?>
                      <span class="badge badge-build">Build Required</span>
                    <?php endif; ?>
                    <?php echo getGitHubLink($project); ?>
                  </div>
                </header>
                <div class="project-content">
                  <p class="project-description"><?php echo htmlspecialchars($project['description']); ?></p>
                  
                  <?php if (isset($project['deployment'])): ?>
                    <div class="deployment-info">
                      <?php if (isset($project['deployment']['packageManager'])): ?>
                        <span class="tech-tag"><?php echo htmlspecialchars($project['deployment']['packageManager']); ?></span>
                      <?php endif; ?>
                      
                      <?php if (isset($project['deployment']['dependencies'])): ?>
                        <?php foreach (array_keys($project['deployment']['dependencies']) as $dep): ?>
                          <span class="tech-tag"><?php echo htmlspecialchars($dep); ?></span>
                        <?php endforeach; ?>
                      <?php endif; ?>
                      
                      <?php if (isset($project['deployment']['backend'])): ?>
                        <span class="tech-tag"><?php echo htmlspecialchars($project['deployment']['backend']['type']); ?></span>
                      <?php endif; ?>
                    </div>
                  <?php endif; ?>
                </div>
                <footer class="project-footer">
                  <a href="<?php echo htmlspecialchars(getProjectUrl($project)); ?>" class="project-link-btn">
                    Explore Project →
                  </a>
                </footer>
              </article>
            <?php endforeach; ?>
          </div>
        </section>
      <?php endforeach; ?>
    </main>
      <footer class="site-footer">
      <div class="footer-content">
        <p>&copy; <?php echo date('Y'); ?> WebHatchery.au · All rights reserved</p>
        <?php if (isset($data['global']['buildTools'])): ?>
          <div class="tech-requirements">
            <small>Platform Requirements: 
              <?php foreach ($data['global']['buildTools'] as $tool => $version): ?>
                <?php echo htmlspecialchars($tool . ' ' . $version); ?> 
              <?php endforeach; ?>
            </small>
          </div>
        <?php endif; ?>
      </div>
    </footer>
  </div>
</body>
</html>
