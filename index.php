<?php
$projectsJson = file_get_contents('projects.json');
$data = json_decode($projectsJson, true);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WebHatchery.au</title>
  <link rel="stylesheet" href="index.css" />
</head>
<body>
  <div class="container">
    <h1>Welcome to WebHatchery.au</h1>
    <p class="tagline">Where ideas hatch into websites.</p>
    <p>This is a development landing page for web experiments, game previews, and digital prototypes.</p>
    
    <div class="links">
      <?php foreach ($data['groups'] as $groupId => $group): ?>
        <div class="link-group">
          <h3><?php echo htmlspecialchars($group['name']); ?></h3>
          <div class="link-items">
            <?php foreach ($group['projects'] as $project): ?>
              <a href="<?php echo htmlspecialchars($project['path']); ?>"><?php echo htmlspecialchars($project['title']); ?></a>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
    
    <div class="project-descriptions">
      <?php foreach ($data['groups'] as $groupId => $group): ?>
        <div class="group">
          <h2><?php echo htmlspecialchars($group['name']); ?></h2>
          <div class="project-group">
            <?php foreach ($group['projects'] as $project): ?>
              <div class="project">
                <h3><a href="<?php echo htmlspecialchars($project['path']); ?>"><?php echo htmlspecialchars($project['title']); ?></a></h3>
                <p><?php echo htmlspecialchars($project['description']); ?></p>
              </div>
            <?php endforeach; ?>
          </div>
        </div>
      <?php endforeach; ?>    </div>
    
    <footer>&copy; <?php echo date('Y'); ?> WebHatchery.au · All rights reserved</footer>
  </div>
</body>
</html>
