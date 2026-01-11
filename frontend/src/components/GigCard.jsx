import api from "../api/axios";

export default function GigCard({ gig }) {
  const bid = async () => {
    await api.post("/bids", {
      gigId: gig._id,
      message: "I am interested in this gig",
      price: gig.budget,
    });
    alert("Bid submitted");
  };

  return (
    <div className="border p-4 mb-3">
      <h3 className="font-semibold">{gig.title}</h3>
      <p>{gig.description}</p>
      <p>Budget: ₹{gig.budget}</p>
      <button onClick={bid} className="mt-2">
        Bid on Gig
      </button>
    </div>
  );
}
