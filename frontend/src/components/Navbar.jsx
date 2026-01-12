import { useState } from "react";
import BidModal from "./BidModal";

export default function GigCard({ gig }) {
  const [showBidModal, setShowBidModal] = useState(false);

  return (
    <>
      <div className="border p-4 mb-3 rounded">
        <h3 className="font-semibold">{gig.title}</h3>
        <p>{gig.description}</p>
        <p>Budget: ₹{gig.budget}</p>

        <button
          className="mt-2"
          onClick={() => setShowBidModal(true)}
        >
          Apply / Bid
        </button>
      </div>

      {showBidModal && (
        <BidModal
          gig={gig}
          onClose={() => setShowBidModal(false)}
        />
      )}
    </>
  );
}
