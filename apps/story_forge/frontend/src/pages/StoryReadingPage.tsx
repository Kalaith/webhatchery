import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { Story, Paragraph } from '../types';
import { useAuth } from '../context/AuthContext';

interface StoryReadingPageProps {
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const StoryReadingPage: React.FC<StoryReadingPageProps> = ({ showToast }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    if (id) {
      const foundStory = apiService.getStory(parseInt(id));
      if (foundStory) {
        setStory(foundStory);
      } else {
        showToast('Story not found', 'error');
        navigate('/');
      }
    }
  }, [id, navigate, showToast]);

  if (!story) {
    return <div>Loading story...</div>; // Or a more elaborate loading state
  }

  const author = apiService.getUser(story.createdBy);

  const accessLevelClass = {
    'anyone': 'access-level-badge--anyone',
    'approved_only': 'access-level-badge--approved',
    'specific_users': 'access-level-badge--specific'
  }[story.accessLevel];

  const accessLevelText = {
    'anyone': 'Open to Anyone',
    'approved_only': 'Approval Required',
    'specific_users': 'Restricted Access'
  }[story.accessLevel];

  const canUserContribute = (userId: number, currentStory: Story) => {
    if (currentStory.blockedUsers.includes(userId)) {
      return false;
    }

    switch (currentStory.accessLevel) {
      case 'anyone':
        return true;
      case 'approved_only':
        return currentStory.approvedContributors.includes(userId) || 
               apiService.getWritingSamplesForStory(currentStory.id).some(sample => 
                sample.userId === userId && 
                sample.status === 'approved'
              );
      case 'specific_users':
        return currentStory.approvedContributors.includes(userId);
      default:
        return false;
    }
  };

  const handleContributeClick = () => {
    if (currentUser && canUserContribute(currentUser.id, story)) {
      navigate(`/write/${story.id}`); // Assuming a writing page route
    } else if (!currentUser) {
      showToast('Please sign in to contribute', 'error');
    } else {
      showToast('You cannot contribute to this story', 'error');
    }
  };

  const handleManageStoryClick = () => {
    navigate(`/manage-story/${story.id}`); // Assuming a story management page route
  };

  return (
    <div id="storyReadingView">
      <div className="container">
        <div className="story-header">
          <button className="btn btn--outline btn--sm back-btn" onClick={() => navigate('/')}>← Back to Stories</button>
          <div className="story-meta">
            <h1 className="story-title">{story.title}</h1>
            <div className="story-info">
              <span className="story-genre">{story.genre}</span>
              <span className="story-author">by {author ? author.username : 'Unknown'}</span>
              <span className={`access-level-badge ${accessLevelClass}`}>{accessLevelText}</span>
            </div>
            <p className="story-description">{story.description}</p>
          </div>
          <div className="story-actions">
            {currentUser && canUserContribute(currentUser.id, story) && (
              <button className="btn btn--primary" onClick={handleContributeClick}>Contribute</button>
            )}
            {currentUser && story.createdBy === currentUser.id && (
              <button className="btn btn--secondary" onClick={handleManageStoryClick}>Manage Story</button>
            )}
          </div>
        </div>
        
        <div className="story-content">
          <div className="paragraphs-container" id="paragraphsContainer">
            {story.paragraphs.map((paragraph: Paragraph) => (
              <div className="paragraph" key={paragraph.id}>
                <div className="paragraph__content">{paragraph.content}</div>
                <div className="paragraph__meta">
                  <span className="paragraph__author">by {paragraph.author}</span>
                  <span className="paragraph__date">{new Date(paragraph.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryReadingPage;