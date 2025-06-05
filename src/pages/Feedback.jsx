import React, { useState, useEffect, useRef } from 'react';
import RatingSummary from '../components/RatingSummary';

const API_FEEDBACK = import.meta.env.VITE_API_FEEDBACK;
const API_EVENT = import.meta.env.VITE_API_EVENT;

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSort, setSelectedSort] = useState('Newest');

  const ratingDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const fetchFeedbackAndEvents = async () => {
      try {
        const [feedbackRes, eventsRes] = await Promise.all([
          fetch(`${API_FEEDBACK}/api/feedback`),
          fetch(`${API_EVENT}/api/event`)
        ]);

        const [feedbackRaw, events] = await Promise.all([
          feedbackRes.json(),
          eventsRes.json()
        ]);

        const enriched = feedbackRaw.map(entry => {
          const matchedEvent = events.find(e => e.id === entry.eventId);
          return {
            ...entry,
            eventTitle: matchedEvent?.title || 'Unknown Event',
            category: matchedEvent?.category || 'Uncategorized'
          };
        });

        setFeedbackData(enriched);
      } catch (err) {
        console.error('Error fetching feedback or events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackAndEvents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(event.target)) {
        setRatingDropdownOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRatingDropdown = () => setRatingDropdownOpen(prev => !prev);
  const toggleCategoryDropdown = () => setCategoryDropdownOpen(prev => !prev);
  const toggleSortDropdown = () => setSortDropdownOpen(prev => !prev);

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setRatingDropdownOpen(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCategoryDropdownOpen(false);
  };

  const handleSortSelect = (sortOption) => {
    setSelectedSort(sortOption);
    setSortDropdownOpen(false);
  };

  const categories = Array.from(new Set(feedbackData.map((e) => e.category))).sort();

  let filteredFeedback = feedbackData.filter(entry => {
    const matchRating = selectedRating ? Math.floor(entry.rating) === selectedRating : true;
    const matchCategory = selectedCategory ? entry.category === selectedCategory : true;
    return matchRating && matchCategory;
  });

  filteredFeedback = filteredFeedback.sort((a, b) => {
    switch (selectedSort) {
      case 'Newest':
        return new Date(b.date) - new Date(a.date);
      case 'Oldest':
        return new Date(a.date) - new Date(b.date);
      case 'Highest Rating':
        return b.rating - a.rating;
      case 'Lowest Rating':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  if (loading) return <p>Loading feedback...</p>;

  return (
    <div className="feedback-page">
      <RatingSummary enrichedFeedback={feedbackData} categories={categories} />

      <div className='feedback-button-bar'>
        <div ref={ratingDropdownRef} className={`feedback-dropdown-wrapper ${ratingDropdownOpen ? 'open' : ''}`}>
          <button className="feedback-dropdown" onClick={toggleRatingDropdown}>
            {selectedRating ? `${selectedRating} ★` : 'All Ratings'}
            <span className="arrow" />
          </button>
          {ratingDropdownOpen && (
            <ul className="feedback-dropdown-list">
              <li onClick={() => handleRatingSelect(null)}>All Ratings</li>
              {[5, 4, 3, 2, 1].map((star) => (
                <li key={star} onClick={() => handleRatingSelect(star)} className={selectedRating === star ? 'selected' : ''}>
                  {star} {'★'.repeat(star)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={categoryDropdownRef} className={`feedback-dropdown-wrapper ${categoryDropdownOpen ? 'open' : ''}`}>
          <button className="feedback-dropdown" onClick={toggleCategoryDropdown}>
            {selectedCategory || 'All Categories'}
            <span className="arrow" />
          </button>
          {categoryDropdownOpen && (
            <ul className="feedback-dropdown-list">
              <li onClick={() => handleCategorySelect(null)}>All Categories</li>
              {categories.map((cat) => (
                <li key={cat} onClick={() => handleCategorySelect(cat)} className={selectedCategory === cat ? 'selected' : ''}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={sortDropdownRef} className={`feedback-dropdown-wrapper ${sortDropdownOpen ? 'open' : ''}`}>
          <button className="feedback-dropdown" onClick={toggleSortDropdown}>
            Sort: {selectedSort}
            <span className="arrow" />
          </button>
          {sortDropdownOpen && (
            <ul className="feedback-dropdown-list">
              {['Newest', 'Oldest', 'Highest Rating', 'Lowest Rating'].map((option) => (
                <li key={option} onClick={() => handleSortSelect(option)} className={selectedSort === option ? 'selected' : ''}>
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <section className="feedback-list">
        {filteredFeedback.length === 0 ? (
          <p>No reviews found for the selected filters.</p>
        ) : (
          filteredFeedback.map((entry) => (
            <div key={entry.id} className="feedback-card">
              <div className="feedback-card-header">
                <h4>{entry.name || 'Anonymous'}</h4>
                <span>{entry.date ? new Date(entry.date).toLocaleDateString() : ''}</span>
              </div>
              <div className="feedback-stars">
                {'★'.repeat(Math.floor(entry.rating))}
                {'☆'.repeat(5 - Math.floor(entry.rating))}
                <span className="feedback-score-small">{entry.rating}</span>
              </div>
              <p className="feedback-text">{entry.comment}</p>
              <div className="feedback-event">
                <span className="feedback-event-title">{entry.eventTitle}</span>
                <span className="feedback-event-category">{entry.category}</span>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Feedback;
