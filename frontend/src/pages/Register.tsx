// @ts-nocheck
import { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerWithPassword } from "../controller/auth.controller.js";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerWithPassword(dispatch, username, password);
      navigate("/dress");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 space-y-4">
        <Typography variant="h4" className="text-center" style={{ fontFamily: "Abril Fatface" }}>
          Register
        </Typography>

        {error && (
          <Typography color="red" className="text-sm text-center">
            {error}
          </Typography>
        )}

        <Input
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          Create Account
        </Button>

        <Typography className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </Typography>
      </form>
    </div>
  );
}
