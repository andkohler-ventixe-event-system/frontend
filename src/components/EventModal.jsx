import React, { useState } from 'react';

export default function EventModal({ event, onAddToCart }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const packages = event.packages;

  const handleAddToCart = () => {
    if (selectedIndex !== null) {
      const packageWithEvent = {
        ...packages[selectedIndex],
        eventTitle: event.title,
        quantity
      };
      onAddToCart(packageWithEvent);
    }
  };

  const incrementQuantity = () => setQuantity(qty => qty + 1);
  const decrementQuantity = () => setQuantity(qty => (qty > 1 ? qty - 1 : 1));

  return (
    <div className="event-modal">
      <div className="event-banner">
        <img src={event.bannerImage} alt={event.title} />
      </div>
      <div className="event-header">
        <div className='modal-header-title'>
          <h2>{event.title}</h2>
          <button><i className="fa-solid fa-share-nodes"></i></button>
        </div>
        <div className="event-info-row">
          <div className="event-meta">
            <p><i className="fa-regular fa-calendar"></i>{' '} {new Date(event.date).toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })} - {new Date(event.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
            <p><i className="fa-solid fa-location-dot"></i> {event.location}</p>
          </div>
          <div className="tickets-right-info">
            <div className='tickets-left'>
              <p>Tickets Left</p>
              <span>{event.ticketsLeft.toLocaleString('en-US')}</span>
            </div>
            <div className="starting-price">
              <p>Starts from</p>
              <span>${event.price}</span>
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <section className="event-about">
            <h4>About Event</h4>
            <p>{event.description}</p>
        </section>
      </div>
      <section className="event-packages">
        <h4>Packages</h4>
        <div className="package-grid">
          {packages.map((pkg, index) => (
            <div key={index} className={`package-card ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => {
                setSelectedIndex(index);
                setQuantity(1);
              }}
            >
              <div className="package-header">
                <h5>{pkg.name}</h5>
                <ul className="package-perks">
                  {pkg.perks.map((perk, i) => (
                    <li key={i}>
                      <i className="fa-solid fa-circle-check"></i> {perk.description}
                    </li>
                  ))}
                </ul>
              </div>
              <span className="package-price">${pkg.price}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="add-to-cart">
        {selectedIndex !== null && (
          <div className="modal-quantity-controls">
            <button className="modal-qty-btn" onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
            <span className="modal-qty-number">{quantity}</span>
            <button className="modal-qty-btn" onClick={incrementQuantity}>+</button>
          </div>
        )}
        <button className="btn-add-to-cart" onClick={handleAddToCart} disabled={selectedIndex === null}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
