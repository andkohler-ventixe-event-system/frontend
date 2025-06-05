import React, { useState } from "react";
import EventModal from "./EventModal";
import { useCart } from "../context/CartContext";

export default function EventModalWrapper({ trigger, event }) {
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCartAndClose = (pkg) => {
    addToCart(pkg);
    setIsOpen(false);
  };

  return (
    <>
      {React.cloneElement(trigger, {
        onClick: () => setIsOpen(true),
      })}

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>✖</button>
            <EventModal event={event} onAddToCart={handleAddToCartAndClose} />
          </div>
        </div>
      )}
    </>
  );
}
