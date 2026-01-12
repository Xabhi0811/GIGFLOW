import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import BidModal from "./BidModal";

export default function GigCard({ gig }) {
    if (!gig) return null;
  const { user } = useAuth();
  const [showBidModal, setShowBidModal] = useState(false);

  const alreadyApplied = gig.bids?.some(
    bid => bid.freelancerId === user._id
  );

  return (
    <>
      <div className="border p-4 rounded bg-white shadow">
        <h3 className="font-semibold text-lg">{gig.title}</h3>
        <p className="text-gray-600">{gig.description}</p>
        <p className="font-medium mt-2">Budget: ₹{gig.budget}</p>

        {alreadyApplied ? (
          <p className="mt-3 text-green-600 font-medium">
            ✔ Already Applied
          </p>
        ) : (
          <button
            className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded"
            onClick={() => setShowBidModal(true)}
          >
            Apply / Bid
          </button>
        )}
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
