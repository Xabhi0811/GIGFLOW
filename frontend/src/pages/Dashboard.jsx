import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [notif, setNotif] = useState("");

  useEffect(() => {
    api.get("/gigs/my").then(res => setMyGigs(res.data));
    api.get("/bids/my").then(res => setMyBids(res.data));

    socket.emit("register", user._id);
    socket.on("hired", data => setNotif(data.message));

    return () => socket.off("hired");
  }, []);

  const hire = async (bidId) => {
    await api.patch(`/bids/${bidId}/hire`);
    alert("Freelancer hired");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl">Dashboard</h2>

      {notif && <p className="text-green-600">{notif}</p>}

      {/* CLIENT VIEW */}
      <h3 className="mt-6">My Gigs</h3>
      {myGigs.map(gig => (
        <div key={gig._id} className="border p-3 mt-2">
          <p>{gig.title}</p>
          {gig.bids?.map(bid => (
            <div key={bid._id}>
              <span>{bid.freelancerId.name}</span>
              <button onClick={() => hire(bid._id)}>Hire</button>
            </div>
          ))}
        </div>
      ))}

      {/* FREELANCER VIEW */}
      <h3 className="mt-6">My Bids</h3>
      {myBids.map(bid => (
        <div key={bid._id}>
          <p>{bid.gigId.title} — {bid.status}</p>
        </div>
      ))}
    </div>
  );
}
