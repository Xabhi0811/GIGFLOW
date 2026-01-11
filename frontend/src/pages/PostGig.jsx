import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function PostGig() {
  const [form, setForm] = useState({ title: "", description: "", budget: "" });
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/gigs", form);
    navigate("/dashboard");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">Post a Gig</h2>
      <input placeholder="Title" onChange={e => setForm({ ...form, title: e.target.value })} />
      <input placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} />
      <input placeholder="Budget" onChange={e => setForm({ ...form, budget: e.target.value })} />
      <button onClick={submit}>Post</button>
    </div>
  );
}
