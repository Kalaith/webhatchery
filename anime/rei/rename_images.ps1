# PowerShell script to rename Rei Ayanami images to descriptive names
# Run this script from the rei directory: cd "e:\WebHatchery\anime\rei"

# Change to the images directory
Set-Location "images"

# Rename images based on their alt text descriptions
Rename-Item "ed434a178adf50fd5e911333bf2b749964cbcd37.jpg" "rei_white_plugsuit_promotional.jpg"
Rename-Item "204d83ddef6bf902bc79217fd86d9f1fed6e7b81.jpg" "rei_concept_art_prototype_plugsuit.jpg"
Rename-Item "61424fc19685bd50b79441afcedd2a467f1b266e.jpg" "rei_character_design_sheet.jpg"
Rename-Item "180c884f_j8b8p3.jpg" "rei_character_development_progression.jpg"
Rename-Item "82302ef881a5a9bf3c2769ce78ef0897f8dafae4.jpg" "rei_figurine_dark_blue_plugsuit.jpg"
Rename-Item "74956502a9c3bbfb14672245797364332119542b.jpg" "rei_figurine_lance_longinus_moonlit.jpg"
Rename-Item "b8f9bea4d9a3e1aaae1f4bbd718889e67d1bfa84.jpg" "rei_official_art_cables_technological.jpg"

Write-Host "All images have been renamed to descriptive filenames!"
Write-Host "You can now update the HTML file to use these new names."
