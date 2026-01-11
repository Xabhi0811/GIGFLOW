import { useEffect, useState } from "react";
import api from "../api/axios";
import GigCard from "../components/GigCard";

export default function Home() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    api.get("/gigs").then(res => setGigs(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Browse Gigs</h2>
      {gigs.map(gig => (
        <GigCard key={gig._id} gig={gig} />
      ))}
    </div>
  );
}
