import React, { useEffect, useState } from 'react';

const RatingSummary = ({ enrichedFeedback, categories }) => {
  const totalRatings = enrichedFeedback.length;
  const overallAvg =
    totalRatings > 0
      ? (
          enrichedFeedback.reduce((sum, f) => sum + f.rating, 0) / totalRatings
        ).toFixed(1)
      : '0.0';

  const getCategoryAverage = (cat) => {
    const entries = enrichedFeedback.filter((f) => f.category === cat);
    if (entries.length === 0) return 0;
    const avg = entries.reduce((sum, f) => sum + f.rating, 0) / entries.length;
    return avg.toFixed(1);
  };

  const [dash, setDash] = useState(0);
  const [animatedBars, setAnimatedBars] = useState({});

  useEffect(() => {
    const targetDash = (overallAvg / 5) * 100;
    const timeout = setTimeout(() => setDash(targetDash), 100);

    const newBars = {};
    categories.forEach((cat) => {
      const avg = getCategoryAverage(cat);
      newBars[cat] = (avg / 5) * 100;
    });

    const barTimeout = setTimeout(() => setAnimatedBars(newBars), 150);

    return () => {
      clearTimeout(timeout);
      clearTimeout(barTimeout);
    };
  }, [overallAvg, categories]);

  return (
    <section className="feedback-rating-summary">
        <div className="rating-ring-container">
        <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="circle" strokeDasharray={`${dash}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="rating-labels">
            <div className="label">Overall Rating</div>
            <div className="score">
                <span className='score-number'>{overallAvg}</span>/5
            </div>
            <div className="count">
                <span className='count-number'>{totalRatings}</span>Reviews
            </div>
        </div>
        </div>
      <div className="feedback-category-bars">
        {categories.map((cat) => {
          const avg = getCategoryAverage(cat);
          return (
            <div key={cat} className="category-bar-row">
              <div className="cat-bar">
                <div className="cat-bar-fill" style={{width: `${animatedBars[cat] || 0}%`, transition: 'width 0.8s ease-out',}}/>
              </div>
              <div className="cat-bar-footer">
                <span className="cat-name">{cat}</span>
                <div className="cat-score">
                    <span className='cat-score-number'>{avg}</span>/5
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RatingSummary;
