import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userType: "",
  });

  const submit = async () => {
    if (!form.userType) {
      alert("Please select Client or Freelancer");
      return;
    }

    const res = await api.post("/auth/register", form);

    if (form.userType === "client") {
      navigate("/client/dashboard");
    } else {
      navigate("/freelancer/home");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Create Account</h2>

      <input
        placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={e => setForm({ ...form, password: e.target.value })}
      />

      <div className="mt-4">
        <p className="mb-2">I want to:</p>

        <label>
          <input
            type="radio"
            name="userType"
            value="client"
            onChange={e => setForm({ ...form, userType: e.target.value })}
          />
          Post Gigs (Client)
        </label>

        <br />

        <label>
          <input
            type="radio"
            name="userType"
            value="freelancer"
            onChange={e => setForm({ ...form, userType: e.target.value })}
          />
          Find Work (Freelancer)
        </label>
      </div>

      <button className="mt-4" onClick={submit}>
        Register
      </button>
    </div>
  );
}
