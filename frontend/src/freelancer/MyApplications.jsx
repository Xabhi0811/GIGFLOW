import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function MyApplications() {
  const [bids, setBids] = useState([]);

  useEffect(() => {
    api.get("/bids/my").then(res => setBids(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">My Applications</h2>

      {bids.map(bid => (
        <div key={bid._id} className="border p-3 mb-2">
          <p><strong>{bid.gigId.title}</strong></p>
          <p>Status: <b>{bid.status}</b></p>
        </div>
      ))}
    </div>
  );
}
