import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Gigs() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get(`/gigs?search=${search}`).then(res => setGigs(res.data));
  }, [search]);

  return (
    <div className="p-6">
      <input placeholder="Search gigs" onChange={e => setSearch(e.target.value)} />
      {gigs.map(gig => (
        <div key={gig._id} className="border p-4 my-2">
          <h3>{gig.title}</h3>
          <p>{gig.description}</p>
          <p>Budget: ₹{gig.budget}</p>
        </div>
      ))}
    </div>
  );
}
