import React from 'react';
import styles from './ProjectSuggestionForm.module.css';
import headerStyles from './Header.module.css';

const ProjectSuggestionForm: React.FC = () => (
  <form className={`form-grid mt-8 ${styles['project-suggestion-form']}`}>
    <div className="form-group">
      <label className="form-label">Project Name *</label>
      <input type="text" className="form-control" required />
    </div>
    <div className="form-group">
      <label className="form-label">Description *</label>
      <textarea className="form-control" rows={4} required></textarea>
    </div>
    <div className="form-group">
      <label className="form-label">Suggested Group</label>
      <select className="form-control">
        <option>Fiction Projects</option>
        <option>Web Applications</option>
        <option>Games & Game Design</option>
        <option>Game Design</option>
        <option>AI & Development Tools</option>
      </select>
    </div>
    <div className="form-group">
      <label className="form-label">Rationale *</label>
      <textarea className="form-control" rows={3} required></textarea>
    </div>
    <div className="form-actions flex gap-4 mt-4">
      <button type="button" className="btn btn-outline">Cancel</button>
      <button type="submit" className={`btn btn-primary ${headerStyles['btn-primary']}`}>Submit Suggestion</button>
    </div>
  </form>
);

export default ProjectSuggestionForm;
