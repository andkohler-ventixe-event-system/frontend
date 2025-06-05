import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_EVENT;

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      for (const item of cart) {
        const eventId = item.eventId;
        const quantity = item.quantity;

        await fetch(`${apiUrl}/api/event/${eventId}/decrease-tickets`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity })
        });
      }

      clearCart();
      navigate('/', { state: { toast: 'Thank you for booking with us!' } });
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>No packages in cart.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <div className="cart-item-left">
                  <div className="event-title">{item.eventTitle}</div>
                  <div className="package-name">{item.name}</div>
                </div>
                <div className="cart-item-right">
                  <div className="package-price">${item.price}</div>
                  <div className="quantity-controls">
                    <button onClick={() => decreaseQuantity(index)} className="qty-btn">−</button>
                    <span className="quantity">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(index)} className="qty-btn">+</button>
                  </div>
                  <button onClick={() => removeFromCart(index)} className="remove-btn">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">Total: ${totalPrice}</div>
        </>
      )}
      <div className="divider-two"></div>
      <h3>Checkout Information</h3>
      <form className="checkout-form" onSubmit={handleBooking}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input type="text" id="address" name="address" required />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input type="text" id="city" name="city" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="zip">Zip Code</label>
            <input type="text" id="zip" name="zip" required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select name="payment" disabled>
              <option>Credit/Debit Card</option>
              <option>PayPal</option>
              <option>Cash on Delivery</option>
            </select>
            <small style={{ color: '#888' }}>Payment disabled for demo</small>
          </div>
        </div>
        <button type="submit" className="submit-order-btn">Book Now</button>
      </form>
    </div>
  );
}
