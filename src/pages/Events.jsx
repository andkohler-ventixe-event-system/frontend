import React, { useState, useRef, useEffect } from 'react';
import EventModal from '../components/EventModal.jsx';
import { useCart } from '../context/CartContext';

const apiUrl = import.meta.env.VITE_API_EVENT;

function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/event`);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleAddToCartAndClose = (pkg) => {
    addToCart(pkg);
    setIsModalOpen(false);
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  const categories = ['All Category', ...new Set(events.map(event => event.category))];

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const filteredEvents =
    selectedCategory === 'All Category'
      ? sortedEvents
      : sortedEvents.filter(event => event.category === selectedCategory);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="event-wrapper">
      <div className='event-top-bar'>
        <form className="search-form">
          <div className="input-wrapper">
            <input type="search" className="form-search-input" placeholder="Search event, location, etc" />
            <button type="submit" className="search-button">
              <i className="fa fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
        <div className="event-category-wrapper" ref={dropdownRef}>
          <button className='event-category' onClick={() => setDropdownOpen(prev => !prev)}>
            {selectedCategory}
            <div className="arrow"></div>
          </button>
          {dropdownOpen && (
            <ul className="event-category-dropdown">
              {categories.map((cat, idx) => (
                <li key={idx} onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                  setDropdownOpen(false);
                }}>
                  {cat}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {paginatedEvents.map(event => (
        <section className="event-list" key={event.id}>
          <div className="card" data-project-id={event.id}>
            <div className='card-left-side'>
              <div className="event-image">
                <img src={event.thumbnailImage} alt="img-placeholder" />
              </div>
              <div className="card-header">
                <div className="card-category">{event.category}</div>
                <h6 className="event-title">{event.title}</h6>
                <span className="card-description">{event.shortDescription}</span>
              </div>
            </div>
            <div className="card-location">
              <div className='card-location-icon'>
                <i className="fa-solid fa-location-dot"></i>
                <span>{event.location}</span>
              </div>
              <div className='card-location-icon'>
                <i className="fa-regular fa-calendar"></i>
                <span>{' '} {new Date(event.date).toLocaleString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })} - {new Date(event.date).toLocaleTimeString('en-US', {
                   hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </div>
            </div>
            <div className="card-tickets">
              <h6>{event.ticketsLeft.toLocaleString('en-US')}</h6>
              <span>Tickets Left</span>
            </div>
            <div className="card-price">
              <span>${event.price}</span>
            </div>
            <div className="card-btn">
              <button type='button' className="card-btn-view" onClick={() => {
                setSelectedEvent(event);
                setIsModalOpen(true);
              }}>View More</button>
            </div>
          </div>
        </section>
      ))}

      <div className="pagination-container">
        <span>Showing {paginatedEvents.length} out of {filteredEvents.length}</span>
        <div className="pagination-controls">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}disabled={currentPage === 1}className="pagination-btn">&lt;</button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button key={pageNum}className={`pagination-btn ${isActive ? 'active' : ''}`}onClick={() => setCurrentPage(pageNum)}>{pageNum}</button>
            );
          })}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}disabled={currentPage === totalPages}className="pagination-btn">&gt;</button>
        </div>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✖</button>
            <EventModal event={selectedEvent} onAddToCart={handleAddToCartAndClose} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
