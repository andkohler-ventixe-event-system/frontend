import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventModalWrapper from "../components/EventModalWrapper";

const apiUrl = import.meta.env.VITE_API_EVENT;

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/event`);
        if (!res.ok) throw new Error("Failed to fetch events");
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

  const latestEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <section className="dashboard-page">
      <header className="dashboard-hero-section">
        <div className="dashboard-banner">
          <h1 className="dashboard-title">Welcome to Galactic Events</h1>
          <p className="dashboard-subtitle">
            Discover amazing experiences across the galaxy.
          </p>
        </div>
        <Link to="/events" className="dashboard-explore-btn">
          Explore All Events
        </Link>
      </header>

      <section className="dashboard-latest-events">
        <h2 className="dashboard-section-title">Upcoming Events</h2>
        <div className="dashboard-event-cards">
          {latestEvents.map((event) => (
            <EventModalWrapper
              key={event.id}
              event={event}
              trigger={React.cloneElement(
                <div className="dashboard-event-card">
                  <div className="dashboard-event-image">
                    <img src={event.bannerImage} alt="img-placeholder" />
                  </div>
                  <div className="dashboard-event-details">
                    <div className="dashboard-event-category">
                      {event.category}
                    </div>
                    <h3 className="dashboard-event-title">{event.title}</h3>
                    <p className="dashboard-event-description">
                      {event.shortDescription}
                    </p>
                    <div className="dashboard-event-meta">
                      <div className="dashboard-event-location">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{event.location}</span>
                      </div>
                      <div className="dashboard-event-date">
                        <i className="fa-regular fa-calendar"></i>
                        <span>
                          {' '}
                          {new Date(event.date).toLocaleString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(event.date).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          ))}
        </div>
      </section>
    </section>
  );
}
