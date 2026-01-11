import { useState } from "react";
import api from "../api/axios";

export default function BidModal({ gig, onClose }) {
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState(gig.budget);
  const [loading, setLoading] = useState(false);

  const submitBid = async () => {
    if (!message || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/bids", {
        gigId: gig._id,
        message,
        price,
      });
      alert("Bid submitted successfully");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[400px] p-6">
        <h2 className="text-lg font-semibold mb-4">
          Bid for: {gig.title}
        </h2>

        <textarea
          placeholder="Write a short proposal..."
          className="w-full border p-2 mb-3"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="number"
          className="w-full border p-2 mb-4"
          placeholder="Your bid amount"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitBid}
            disabled={loading}
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </div>
      </div>
    </div>
  );
}
