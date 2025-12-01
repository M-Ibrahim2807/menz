import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_BASE}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to load profile');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container">Loading profile...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!user) return <div className="container">User not found.</div>;

  return (
    <div className="container">
      <h2>My Profile</h2>

      <div style={{ maxWidth: '500px', margin: '0 auto', marginTop: 24 }}>
        <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>Email</label>
            <p>{user.email}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>Username</label>
            <p>{user.username}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>Phone</label>
            <p>{user.phone || 'Not set'}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>Address</label>
            <p>{user.address || 'Not set'}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>User Type</label>
            <p>{user.user_type || 'customer'}</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 700 }}>Joined</label>
            <p>{new Date(user.date_joined).toLocaleDateString()}</p>
          </div>

          <div style={{ marginTop: 24 }}>
            <Link to="/profile/edit">
              <button className="auth-button primary">Edit Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
