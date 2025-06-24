import React from 'react';

const FeatureRequestForm: React.FC = () => (
  <form className="form-grid mt-8">
    <div className="form-group">
      <label className="form-label">Title *</label>
      <input type="text" className="form-control" required />
    </div>
    <div className="form-group">
      <label className="form-label">Description *</label>
      <textarea className="form-control" rows={4} required></textarea>
    </div>
    <div className="form-row flex gap-4">
      <div className="form-group flex-1">
        <label className="form-label">Category</label>
        <select className="form-control">
          <option>Bug Fix</option>
          <option>New Feature</option>
          <option>Enhancement</option>
          <option>UI/UX Improvement</option>
        </select>
      </div>
      <div className="form-group flex-1">
        <label className="form-label">Priority</label>
        <select className="form-control">
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
          <option>Critical</option>
        </select>
      </div>
    </div>
    <div className="form-group">
      <label className="form-label">Tags (comma-separated)</label>
      <input type="text" className="form-control" placeholder="ui, performance, mobile" />
    </div>
    <div className="form-actions flex gap-4 mt-4">
      <button type="button" className="btn btn-outline">Cancel</button>
      <button type="submit" className="btn btn-primary">Submit Request</button>
    </div>
  </form>
);

export default FeatureRequestForm;
