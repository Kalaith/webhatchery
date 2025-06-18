// Report generation functionality
class ReportGenerator {
    constructor(projectManager) {
        this.manager = projectManager;
    }

    generateResults() {
        const projectCharter = this.generateProjectCharter();
        const charterElement = document.getElementById('projectCharter');
        if (charterElement) charterElement.innerHTML = projectCharter;
        
        const riskAssessment = this.generateRiskAssessment();
        const riskElement = document.getElementById('riskAssessment');
        if (riskElement) riskElement.innerHTML = riskAssessment;
        
        const timelineOverview = this.generateTimelineOverview();
        const timelineElement = document.getElementById('timelineOverview');
        if (timelineElement) timelineElement.innerHTML = timelineOverview;
        
        const stakeholderAnalysis = this.generateStakeholderAnalysis();
        const stakeholderElement = document.getElementById('stakeholderAnalysis');
        if (stakeholderElement) stakeholderElement.innerHTML = stakeholderAnalysis;
    }

    generateProjectCharter() {
        const data = this.manager.projectData;
        return `
            <h4>Project Purpose</h4>
            <p>This project aims to deliver <strong>${data.projectName || 'the defined project'}</strong> to meet organizational objectives and stakeholder needs.</p>
            
            <h4>Project Type</h4>
            <p>${data.projectType || 'Not specified'}</p>
            
            <h4>Project Description</h4>
            <p>${data.projectDescription || 'No description provided'}</p>
            
            <h4>Scope</h4>
            <ul>
                <li><strong>In Scope:</strong> ${data.deliverables || 'Key deliverables as defined'}</li>
                <li><strong>Out of Scope:</strong> Items not explicitly listed in deliverables</li>
            </ul>
            
            <h4>Success Criteria</h4>
            <ul>
                <li>Delivery within ${data.timeline || 'specified'} timeframe</li>
                <li>Budget adherence within ${data.budget || 'allocated'} range</li>
                <li>Stakeholder satisfaction > 85%</li>
                ${data.successCriteria ? `<li>${data.successCriteria}</li>` : ''}
            </ul>
            
            <h4>Key Assumptions</h4>
            <ul>
                <li>Resource availability as planned (Team size: ${data.teamSize || 'TBD'})</li>
                <li>Stakeholder engagement as committed</li>
                <li>No major scope changes during execution</li>
                ${data.constraints ? `<li>Constraints: ${data.constraints}</li>` : ''}
            </ul>
        `;
    }

    generateRiskAssessment() {
        const data = this.manager.projectData;
        const risks = [...this.manager.data.defaultRisks];
        
        if (data.potentialRisks) {
            risks.unshift({
                risk: "User-Identified Risk",
                category: "Custom",
                probability: "Medium",
                impact: "Medium",
                mitigation: data.mitigationStrategies || "Mitigation strategy to be defined",
                level: "medium"
            });
        }
        
        let html = '<div class="risk-matrix">';
        risks.forEach(risk => {
            html += `
                <div class="risk-item ${risk.level}">
                    <h5>${risk.risk}</h5>
                    <div class="risk-meta">
                        <strong>Category:</strong> ${risk.category} | 
                        <strong>Probability:</strong> ${risk.probability} | 
                        <strong>Impact:</strong> ${risk.impact}
                    </div>
                    <div class="risk-mitigation">
                        <strong>Mitigation:</strong> ${risk.mitigation}
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        return html;
    }

    generateTimelineOverview() {
        const timeline = this.manager.projectData.timeline;
        const milestones = this.generateMilestones(timeline);
        
        let html = '<div class="timeline">';
        milestones.forEach((milestone, index) => {
            html += `
                <div class="timeline-item">
                    <div class="timeline-marker">${index + 1}</div>
                    <div class="timeline-content">
                        <h5>${milestone.title}</h5>
                        <div class="timeline-date">${milestone.date}</div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        return html;
    }

    generateMilestones(timeline) {
        const milestones = [...this.manager.data.baseMilestones];
        
        if (timeline && this.manager.data.timelineMap[timeline]) {
            milestones.forEach((milestone, index) => {
                milestone.date = this.manager.data.timelineMap[timeline][index];
            });
        }
        
        return milestones;
    }

    generateStakeholderAnalysis() {
        const stakeholders = this.manager.projectData.stakeholders || [];
        
        if (stakeholders.length === 0) {
            return '<p>No stakeholders have been defined for this project.</p>';
        }
        
        let html = '<div class="stakeholder-grid">';
        stakeholders.forEach(stakeholder => {
            if (stakeholder.name && stakeholder.type) {
                const influence = this.getStakeholderInfluence(stakeholder.type);
                html += `
                    <div class="stakeholder-card">
                        <h5>${stakeholder.name}</h5>
                        <div class="stakeholder-role">${stakeholder.type}</div>
                        <div class="stakeholder-influence">
                            <strong>Influence:</strong> ${influence.level}<br>
                            <strong>Engagement Strategy:</strong> ${influence.strategy}
                        </div>
                    </div>
                `;
            }
        });
        html += '</div>';
        
        return html;
    }

    getStakeholderInfluence(type) {
        return this.manager.data.stakeholderInfluenceMap[type] || { 
            level: "Medium", 
            strategy: "Keep informed - regular updates" 
        };
    }
}
