// Export functionality for Project Manager
class ProjectExporter {
    constructor(projectManager) {
        this.manager = projectManager;
    }

    showExportOptions() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal__content">
                <div class="modal__header">
                    <h3>Export Project Analysis</h3>
                    <button class="modal__close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal__body">
                    <p>Choose your export format:</p>
                    <div class="export-options">
                        <button class="btn btn--outline export-btn" data-format="json">JSON Data</button>
                        <button class="btn btn--outline export-btn" data-format="pdf">PDF Report</button>
                        <button class="btn btn--outline export-btn" data-format="html">HTML Report</button>
                        <button class="btn btn--outline export-btn" data-format="csv">CSV Summary</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportInFormat(btn.dataset.format);
                modal.remove();
            });
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    exportInFormat(format) {
        switch(format) {
            case 'json':
                this.exportJSON();
                break;
            case 'pdf':
                this.exportPDF();
                break;
            case 'html':
                this.exportHTML();
                break;
            case 'csv':
                this.exportCSV();
                break;
        }
    }

    exportJSON() {
        const exportData = {
            projectData: this.manager.projectData,
            generatedAt: new Date().toISOString(),
            projectName: this.manager.projectData.projectName || 'Untitled Project',
            summary: {
                projectType: this.manager.projectData.projectType,
                timeline: this.manager.projectData.timeline,
                budget: this.manager.projectData.budget,
                teamSize: this.manager.projectData.teamSize,
                stakeholderCount: (this.manager.projectData.stakeholders || []).length
            }
        };
        
        const filename = `${exportData.projectName.replace(/\s+/g, '_')}_analysis.json`;
        ProjectUtils.downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
    }

    exportPDF() {
        const printWindow = window.open('', '_blank');
        const projectName = this.manager.projectData.projectName || 'Project_Analysis';
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>${projectName} - Analysis Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1, h2, h3 { color: #333; }
                    .section { margin-bottom: 30px; }
                    .risk-item { margin: 10px 0; padding: 10px; border-left: 3px solid #ccc; }
                    .stakeholder-card { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <h1>${projectName} - Project Analysis Report</h1>
                <div class="section">
                    <h2>Project Charter</h2>
                    ${this.manager.reportGenerator.generateProjectCharter()}
                </div>
                <div class="section">
                    <h2>Risk Assessment</h2>
                    ${this.manager.reportGenerator.generateRiskAssessment()}
                </div>
                <div class="section">
                    <h2>Timeline Overview</h2>
                    ${this.manager.reportGenerator.generateTimelineOverview()}
                </div>
                <div class="section">
                    <h2>Stakeholder Analysis</h2>
                    ${this.manager.reportGenerator.generateStakeholderAnalysis()}
                </div>
                <div class="section">
                    <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    exportHTML() {
        const projectName = this.manager.projectData.projectName || 'Project_Analysis';
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${projectName} - Analysis Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
                    h1, h2, h3 { color: #2c5aa0; }
                    .section { margin-bottom: 30px; }
                    .risk-item { margin: 10px 0; padding: 15px; border-left: 4px solid #f39c12; background: #fdf6e3; }
                    .risk-item.high { border-color: #e74c3c; }
                    .risk-item.medium { border-color: #f39c12; }
                    .risk-item.low { border-color: #27ae60; }
                    .stakeholder-card { margin: 10px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                    .timeline-item { margin: 10px 0; padding: 10px; background: #f8f9fa; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1>${projectName} - Project Analysis Report</h1>
                <div class="section">
                    <h2>Project Charter</h2>
                    ${this.manager.reportGenerator.generateProjectCharter()}
                </div>
                <div class="section">
                    <h2>Risk Assessment</h2>
                    ${this.manager.reportGenerator.generateRiskAssessment()}
                </div>
                <div class="section">
                    <h2>Timeline Overview</h2>
                    ${this.manager.reportGenerator.generateTimelineOverview()}
                </div>
                <div class="section">
                    <h2>Stakeholder Analysis</h2>
                    ${this.manager.reportGenerator.generateStakeholderAnalysis()}
                </div>
                <div class="section">
                    <p><em>Generated on ${new Date().toLocaleDateString()} using AI Project Manager</em></p>
                </div>
            </body>
            </html>
        `;
        
        const filename = `${projectName.replace(/\s+/g, '_')}_report.html`;
        ProjectUtils.downloadFile(htmlContent, filename, 'text/html');
    }

    exportCSV() {
        const projectName = this.manager.projectData.projectName || 'Project_Analysis';
        const csvContent = [
            ['Field', 'Value'],
            ['Project Name', this.manager.projectData.projectName || ''],
            ['Project Type', this.manager.projectData.projectType || ''],
            ['Timeline', this.manager.projectData.timeline || ''],
            ['Budget', this.manager.projectData.budget || ''],
            ['Team Size', this.manager.projectData.teamSize || ''],
            ['Description', this.manager.projectData.projectDescription || ''],
            ['Objectives', this.manager.projectData.objectives || ''],
            ['Deliverables', this.manager.projectData.deliverables || ''],
            ['Success Criteria', this.manager.projectData.successCriteria || ''],
            ['Constraints', this.manager.projectData.constraints || ''],
            ['Potential Risks', this.manager.projectData.potentialRisks || ''],
            ['Mitigation Strategies', this.manager.projectData.mitigationStrategies || ''],
            ['Dependencies', this.manager.projectData.dependencies || ''],
            ['Communication Needs', this.manager.projectData.communicationNeeds || ''],
            ['Export Date', new Date().toISOString()]
        ];
        
        if (this.manager.stakeholderManager.stakeholders.length > 0) {
            csvContent.push(['', '']);
            csvContent.push(['Stakeholders', '']);
            this.manager.stakeholderManager.stakeholders.forEach((stakeholder, index) => {
                csvContent.push([`Stakeholder ${index + 1} Name`, stakeholder.name || '']);
                csvContent.push([`Stakeholder ${index + 1} Type`, stakeholder.type || '']);
            });
        }
        
        const csvString = csvContent.map(row => 
            row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
        const filename = `${projectName.replace(/\s+/g, '_')}_data.csv`;
        ProjectUtils.downloadFile(csvString, filename, 'text/csv');
    }
}
