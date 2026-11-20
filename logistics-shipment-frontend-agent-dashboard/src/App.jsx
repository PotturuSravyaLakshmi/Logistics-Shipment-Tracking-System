
import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  Package,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import {
  clearToken,
  endpoints,
  getToken,
  saveToken,
} from "./api";

const label = (s) => String(s || "ORDERED").replaceAll("_", " ");
const cls = (s) => String(s || "ordered").toLowerCase();

const dateText = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toLocaleString();
};

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const change = (e) =>
    setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (mode === "register") {
        await endpoints.register({
          full_name: f.full_name.trim(),
          email: f.email.trim(),
          password: f.password,
        });
      }

      const r = await endpoints.login({
        email: f.email.trim(),
        password: f.password,
      });

      if (!r?.access_token) {
        throw new Error("API did not return access_token");
      }

      saveToken(r.access_token);
      onAuth(await endpoints.me());
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-art">
        <div className="brand light">
          <span className="mark"><Package /></span>
          Logistics Shipment Tracking System
        </div>

        <div className="art-copy">
          <span className="eyebrow">
            SHIPMENT VISIBILITY, SIMPLIFIED
          </span>
          <h1>
            Every parcel has a story.
            <br />
            <em>Track every step.</em>
          </h1>
          <p>
            Create shipments, follow delivery progress, and keep every
            update in one place.
          </p>
          <div className="art-steps">
            <span><Package /></span>
            <i />
            <span><Truck /></span>
            <i />
            <span><PackageCheck /></span>
          </div>
          <small>ORDERED　　IN TRANSIT　　DELIVERED</small>
        </div>

        <div className="art-foot">
          LOGISTICS SHIPMENT TRACKING SYSTEM
        </div>
      </section>

      <section className="auth-wrap">
        <div className="auth-card">
          <div className="mobile-brand brand">
            <span className="mark"><Package /></span>
            Logistics Shipment Tracking System
          </div>

          <span className="eyebrow">
            {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
          </span>

          <h2>
            {mode === "login"
              ? "Sign in to your workspace"
              : "Create your account"}
          </h2>

          <p className="muted">
            {mode === "login"
              ? "Enter your details to access your shipments."
              : "New accounts are created with the customer role."}
          </p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={submit} className="form">
            {mode === "register" && (
              <label>
                Full name
                <input
                  name="full_name"
                  value={f.full_name}
                  onChange={change}
                  required
                  placeholder="Your full name"
                />
              </label>
            )}

            <label>
              Email address
              <input
                name="email"
                type="email"
                value={f.email}
                onChange={change}
                required
                placeholder="you@example.com"
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={f.password}
                onChange={change}
                required
                minLength={mode === "register" ? 8 : undefined}
                placeholder="Enter your password"
              />
            </label>

            <button className="primary wide" disabled={busy}>
              {busy
                ? "Please wait…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="switch">
            {mode === "login"
              ? "Don't have an account?"
              : "Already registered?"}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          <div className="secure">
            <ShieldCheck size={16} />
            Token-based authentication
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ icon: Icon, title, value, tone }) {
  return (
    <div className="stat">
      <span className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </span>
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function CreateModal({ close, created }) {
  const [f, setF] = useState({
    description: "",
    origin: "",
    destination: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const change = (e) =>
    setF({ ...f, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      await endpoints.createShipment({
        description: f.description.trim(),
        origin: f.origin.trim(),
        destination: f.destination.trim(),
      });
      await created();
      close();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="backdrop"
      onMouseDown={(e) =>
        e.target === e.currentTarget && close()
      }
    >
      <section className="modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">NEW SHIPMENT</span>
            <h2>Create a shipment</h2>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={close}
          >
            <X />
          </button>
        </div>

        <p className="muted">
          The backend generates the tracking code.
        </p>

        {error && <div className="error">{error}</div>}

        <form className="form" onSubmit={submit}>
          <label>
            Description
            <input
              name="description"
              value={f.description}
              onChange={change}
              required
              placeholder="Documents"
            />
          </label>

          <div className="two">
            <label>
              Origin
              <input
                name="origin"
                value={f.origin}
                onChange={change}
                required
                placeholder="Hyderabad"
              />
            </label>

            <label>
              Destination
              <input
                name="destination"
                value={f.destination}
                onChange={change}
                required
                placeholder="Delhi"
              />
            </label>
          </div>

          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={close}
            >
              Cancel
            </button>
            <button className="primary" disabled={busy}>
              {busy ? "Creating…" : "Create shipment"}
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Tracking() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function search(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);

    try {
      setResult(await endpoints.tracking(code));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

 const shipment = result?.shipment || result;
const events =
  result?.events ||
  result?.tracking_events ||
  (Array.isArray(result) ? result : []) ||
  shipment?.events ||
  [];
  const currentStatus = shipment?.current_status || shipment?.status || "ORDERED";
  return (
    <section className="panel" id="tracking">
      <div className="section-head">
        <div>
          <span className="eyebrow">PUBLIC TRACKING</span>
          <h2>Track a parcel</h2>
          <p className="muted">
            Look up a shipment by its tracking code.
          </p>
        </div>
        <span className="heading-icon"><Search /></span>
      </div>

      <form className="track-search" onSubmit={search}>
        <Search size={18} />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Enter tracking code"
        />
        <button className="primary" disabled={busy}>
          {busy ? "Searching…" : "Track parcel"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="track-result">
          <div className="result-head">
            <div>
              <small>TRACKING CODE</small>
              <h3>{shipment?.tracking_code || code}</h3>
            </div>
            <span className={`pill ${cls(currentStatus)}`}>
            {label(currentStatus)}
            </span>
          </div>

          <div className="route">
            <div>
              <small>ORIGIN</small>
              <strong>
                <MapPin size={15} />
                {shipment?.origin || "—"}
              </strong>
            </div>
            <ArrowRight />
            <div>
              <small>DESTINATION</small>
              <strong>
                <MapPin size={15} />
                {shipment?.destination || "—"}
              </strong>
            </div>
          </div>

          <h4>Tracking history</h4>

          {events.length ? (
            <div className="timeline">
              {events.map((ev, i) => (
                <div className="event" key={ev.id || i}>
                  <CheckCircle2 size={17} />
                  <div>
                    <strong>{label(ev.status)}</strong>
                    <p>
                      {ev.location ||
                        ev.hub?.name ||
                        ev.notes ||
                        ev.note ||
                        "Shipment status updated"}
                    </p>
                    <small>
                      {dateText(
                        ev.created_at ||
                        ev.timestamp ||
                        ev.event_time
                      )}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">
              No event list found in the expected response fields.
              Check your API response schema.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function AgentShipmentActions({ shipment, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState(
    shipment.status || "ORDERED"
  );
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [hubId, setHubId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadHistory() {
    setError("");
    try {
      const d = await endpoints.shipmentEvents(shipment.id);
      setEvents(Array.isArray(d) ? d : []);
      setOpen(true);
    } catch (e) {
      setError(e.message);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      await endpoints.createEvent(shipment.id, {
        status,
        location: location.trim(),
        note: note.trim(),
        hub_id: hubId.trim() ? Number(hubId) : null,
      });

      setNotice("Tracking event added.");
      setLocation("");
      setNote("");
      setHubId("");

      await loadHistory();
      await onUpdated();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="agent-actions">
      <button
        className="secondary"
        type="button"
        onClick={loadHistory}
      >
        <Clock3 size={15} /> History
      </button>

      <form className="agent-event-form" onSubmit={submit}>
        <strong>Update shipment #{shipment.id}</strong>

        <label>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ORDERED">ORDERED</option>
            <option value="TRANSIT">TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
        </label>

        <label>
          Current location *
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            minLength={2}
            maxLength={160}
            required
            placeholder="e.g. Hyderabad Hub"
          />
        </label>

        <label>
          Note (optional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            placeholder="Tracking note"
          />
        </label>

        <label>
          Hub ID (optional)
          <input
            type="number"
            min="1"
            step="1"
            value={hubId}
            onChange={(e) => setHubId(e.target.value)}
            placeholder="Hub ID"
          />
        </label>

        <button className="primary" disabled={busy}>
          {busy ? "Saving…" : "Update status"}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {notice && <div className="success">{notice}</div>}

      {open && (
        <div className="agent-history">
          <div className="section-head">
            <h3>Tracking history</h3>
            <button
              type="button"
              className="icon-button"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          {events.length ? (
            <div className="timeline">
              {events.map((ev) => (
                <div className="event" key={ev.id}>
                  <CheckCircle2 size={17} />
                  <div>
                    <strong>{label(ev.status)}</strong>
                    <p>{ev.location}</p>
                    {ev.note && <p>{ev.note}</p>}
                    {ev.hub_id != null && (
                      <small>Hub ID: {ev.hub_id}</small>
                    )}
                    <small>{dateText(ev.created_at)}</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No tracking events yet.</p>
          )}
        </div>
      )}
    </div>
  );
}


function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [hubs, setHubs] = useState([]);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [hubForm, setHubForm] = useState({
    name: "",
    city: "",
    address: "",
  });

  const [hubBusy, setHubBusy] = useState(false);
  const [hubError, setHubError] = useState("");
  const [hubNotice, setHubNotice] = useState("");

  async function loadHubs() {
    try {
      const data = await endpoints.hubs();
      setHubs(Array.isArray(data) ? data : []);
      setHubError("");
    } catch (e) {
      setHubError(e.message || "Unable to load hubs.");
    }
  }

  async function loadAdminData() {
    setBusy(true);
    setError("");

    try {
      const [statsData, usersData, hubsData] = await Promise.all([
        endpoints.adminStats(),
        endpoints.adminUsers(),
        endpoints.hubs(),
      ]);

      setStats(statsData);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setHubs(Array.isArray(hubsData) ? hubsData : []);
    } catch (e) {
      setError(e.message || "Unable to load admin data.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadAdminData();
  }, []);

  async function deactivateAgent(userId) {
    const confirmed = window.confirm(
      "Deactivate this agent? Their shipment history will be preserved."
    );

    if (!confirmed) return;

    setBusy(true);
    setError("");
    setNotice("");

    try {
      await endpoints.deactivateAgent(userId);
      setNotice(`Agent #${userId} deactivated successfully.`);
      await loadAdminData();
    } catch (e) {
      setError(e.message || "Unable to deactivate agent.");
    } finally {
      setBusy(false);
    }
  }

  async function submitHub(e) {
    e.preventDefault();
    setHubBusy(true);
    setHubError("");
    setHubNotice("");

    try {
      await endpoints.createHub({
        name: hubForm.name.trim(),
        city: hubForm.city.trim(),
        address: hubForm.address.trim(),
      });

      setHubForm({
        name: "",
        city: "",
        address: "",
      });

      setHubNotice("Hub added successfully!");
      await loadHubs();
    } catch (e) {
      setHubError(e.message || "Unable to add hub.");
    } finally {
      setHubBusy(false);
    }
  }

  async function changeRole(userId, newRole) {
    setError("");
    setNotice("");

    try {
      await endpoints.updateUserRole(userId, newRole);
      setNotice(`User #${userId} role updated to ${newRole}.`);
      await loadAdminData();
    } catch (e) {
      setError(e.message || "Unable to update user role.");
    }
  }

  const filteredUsers = users.filter((u) =>
    [u.full_name, u.email, u.role].some((v) =>
      String(v || "")
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  );

  return (
    <section className="panel admin-panel" id="admin">
      <div className="section-head">
        <div>
          <span className="eyebrow">ADMINISTRATION</span>
          <h2>Admin dashboard</h2>
          <p className="muted">
            Manage hubs, registered users, and access roles.
          </p>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={loadAdminData}
          disabled={busy}
        >
          <RefreshCw size={15} />
          {busy ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {notice && <div className="success">{notice}</div>}

      {/* ADMIN STATISTICS */}
      <div className="stats admin-stats">
        <Stat
          icon={UserRound}
          title="Total users"
          value={stats?.total_users ?? "—"}
          tone="blue"
        />
        <Stat
          icon={UserRound}
          title="Customers"
          value={stats?.customers ?? "—"}
          tone="green"
        />
        <Stat
          icon={Truck}
          title="Agents"
          value={stats?.agents ?? "—"}
          tone="purple"
        />
        <Stat
          icon={ShieldCheck}
          title="Admins"
          value={stats?.admins ?? "—"}
          tone="amber"
        />
      </div>

      {/* ADD HUB FORM */}
      <div className="section-head">
        <div>
          <span className="eyebrow">HUB MANAGEMENT</span>
          <h2>Add a hub</h2>
          <p className="muted">
            Register a new logistics hub in your network.
          </p>
        </div>
        <span className="heading-icon">
          <MapPin />
        </span>
      </div>

      {hubError && <div className="error">{hubError}</div>}
      {hubNotice && <div className="success">{hubNotice}</div>}

      <form className="form" onSubmit={submitHub}>
        <label>
          Hub name
          <input
            value={hubForm.name}
            onChange={(e) =>
              setHubForm({ ...hubForm, name: e.target.value })
            }
            required
            minLength={2}
            maxLength={120}
            placeholder="Hyderabad Central Hub"
          />
        </label>

        <label>
          City
          <input
            value={hubForm.city}
            onChange={(e) =>
              setHubForm({ ...hubForm, city: e.target.value })
            }
            required
            minLength={2}
            maxLength={120}
            placeholder="Hyderabad"
          />
        </label>

        <label>
          Address
          <input
            value={hubForm.address}
            onChange={(e) =>
              setHubForm({ ...hubForm, address: e.target.value })
            }
            maxLength={250}
            placeholder="Madhapur, Hyderabad"
          />
        </label>

        <div className="actions">
          <button
            type="button"
            className="secondary"
            disabled={hubBusy}
            onClick={() => {
              setHubForm({ name: "", city: "", address: "" });
              setHubError("");
              setHubNotice("");
            }}
          >
            Clear
          </button>

          <button className="primary" disabled={hubBusy}>
            <Plus size={17} />
            {hubBusy ? "Adding hub…" : "Add hub"}
          </button>
        </div>
      </form>

      {/* ALL HUBS TABLE */}
      <div className="section-head">
        <div>
          <h2>All hubs</h2>
          <p className="muted">{hubs.length} hub(s) registered</p>
        </div>

        <button
          type="button"
          className="secondary"
          onClick={loadHubs}
        >
          <RefreshCw size={15} />
          Refresh hubs
        </button>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>HUB NAME</th>
              <th>CITY</th>
              <th>ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {hubs.map((hub) => (
              <tr key={hub.id}>
                <td>{hub.id}</td>
                <td><strong>{hub.name}</strong></td>
                <td>{hub.city}</td>
                <td>{hub.address || "—"}</td>
              </tr>
            ))}

            {hubs.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <div className="empty">
                    <MapPin size={24} />
                    <strong>No hubs registered yet</strong>
                    <p>Add your first hub using the form above.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-foot">Showing {hubs.length} hubs</div>

      {/* USER MANAGEMENT */}
      <div className="section-head">
        <div>
          <h2>User management</h2>
          <p className="muted">
            Search users, update roles, and deactivate agents.
          </p>
        </div>
      </div>

      <label className="search-box admin-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, or role"
        />
      </label>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>USER</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>STATUS</th>
              <th>CHANGE ROLE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => {
              const userRole = String(
                u.role || "customer"
              ).toLowerCase();

              const isActive = u.is_active !== false;

              return (
                <tr key={u.id}>
                  <td>
                    <strong>{u.full_name}</strong>
                    <br />
                    <small>User #{u.id}</small>
                  </td>

                  <td>{u.email}</td>

                  <td>
                    <span className={`pill ${userRole}`}>
                      {userRole.toUpperCase()}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`pill ${
                        isActive ? "active" : "inactive"
                      }`}
                    >
                      {isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </td>

                  <td>
                    <select
                      value={userRole}
                      disabled={busy || userRole === "admin"}
                      onChange={(e) =>
                        changeRole(u.id, e.target.value)
                      }
                      aria-label={`Change role for ${u.full_name}`}
                    >
                      <option value="customer">Customer</option>
                      <option value="agent">Agent</option>
                      {userRole === "admin" && (
                        <option value="admin">Admin</option>
                      )}
                    </select>

                    {userRole === "admin" && (
                      <small className="muted">
                        Admin role protected in this interface
                      </small>
                    )}
                  </td>

                  <td>
                    {userRole === "agent" && isActive && (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() => deactivateAgent(u.id)}
                        disabled={busy}
                      >
                        Deactivate
                      </button>
                    )}

                    {userRole === "agent" && !isActive && (
                      <span className="muted">Deactivated</span>
                    )}

                    {userRole !== "agent" && (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {!busy && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div className="empty">
                    <UserRound size={24} />
                    <strong>No users found</strong>
                    <p>Try another search or refresh the list.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-foot">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </section>
  );
}



export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const d = await endpoints.shipments();
      setShipments(
        Array.isArray(d) ? d : d?.items || d?.shipments || []
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!getToken()) return;

    endpoints.me()
      .then(setUser)
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user]);

  const shown = useMemo(
    () =>
      shipments.filter(
        (s) =>
          [
            s.tracking_code,
            s.description,
            s.origin,
            s.destination,
          ].some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(query.toLowerCase())
          ) &&
          (filter === "ALL" ||
            String(s.status || "").toUpperCase() === filter)
      ),
    [shipments, query, filter]
  );

  const count = (status) =>
    shipments.filter((s) => s.status === status).length;

  const role = String(user?.role || "").toLowerCase();
  
const canManageShipments = role === "agent";


  async function created() {
    await load();
    setNotice(
      "Shipment created. Check the list for its tracking code."
    );
  }

  function logout() {
    clearToken();
    setUser(null);
    setShipments([]);
  }

  if (checking) {
    return (
      <div className="loading">
        <div className="spinner" />
        Checking your session…
      </div>
    );
  }

  if (!user) return <Auth onAuth={setUser} />;

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="mark"><Package /></span>
          Logistics Shipment Tracking System
        </div>

        <div className="nav-label">WORKSPACE</div>

        <a className="nav active" href="#overview">
          <Box size={18} /> Overview
        </a>

        <a className="nav" href="#shipments">
          <Package size={18} /> Shipments
        </a>

        {role === "admin" && (
          <a className="nav" href="#admin">
            <ShieldCheck size={18} /> Admin
          </a>
        )}

        <a className="nav" href="#tracking">
          <Search size={18} /> Track parcel
        </a>

        <div className="side-bottom">
          <div className="side-person">
            <span className="avatar"><UserRound /></span>
            <div>
              <strong>{user.full_name || user.email}</strong>
              <small>
                {String(user.role || "customer").toUpperCase()}
              </small>
            </div>
          </div>

          <button className="logout" onClick={logout}>
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <span>Workspace <b>/</b> Overview</span>
          <div><i /> {user.full_name || user.email}</div>
        </header>

        <div className="content">
          {role === "admin" && <AdminDashboard />}

          {notice && (
            <div className="success">
              {notice}
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          <section className="welcome" id="overview">
            <div>
              <span className="eyebrow">
                SHIPMENT MANAGEMENT
              </span>
              <h1>
                Good to see you,{" "}
                {(user.full_name || "there").split(" ")[0]}.
              </h1>
              <p>
                Here’s what’s happening with your shipments today.
              </p>
            </div>

            
{role !== "admin" && (
  <button
    className="primary"
    onClick={() => setModal(true)}
  >
    <Plus size={18} /> New shipment
  </button>
)}

          </section>

          {error && (
            <div className="error">
              {error}
              <button className="secondary" onClick={load}>
                Retry
              </button>
            </div>
          )}

          <section className="stats">
            <Stat
              icon={Package}
              title="Total shipments"
              value={shipments.length}
              tone="blue"
            />
            <Stat
              icon={Clock3}
              title="Ordered"
              value={count("ORDERED")}
              tone="amber"
            />
            <Stat
              icon={Truck}
              title="In transit"
              value={count("TRANSIT")}
              tone="purple"
            />
            <Stat
              icon={PackageCheck}
              title="Delivered"
              value={count("DELIVERED")}
              tone="green"
            />
          </section>

          <section className="panel" id="shipments">
            <div className="section-head">
              <div>
                <span className="eyebrow">YOUR PARCELS</span>
                <h2>Shipments</h2>
                <p className="muted">
                  Search and review your shipment records.
                </p>
              </div>

              <button
                className="secondary"
                onClick={load}
                disabled={loading}
              >
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            <div className="tools">
              <label className="search-box">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code, route or description"
                />
              </label>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="ALL">All statuses</option>
                <option value="ORDERED">Ordered</option>
                <option value="TRANSIT">In transit</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>SHIPMENT</th>
                    <th>ROUTE</th>
                    <th>STATUS</th>
                    <th>CREATED</th>
                    {canManageShipments && (
                      <th>AGENT ACTIONS</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={canManageShipments ? 5 : 4}>
                        Loading shipments…
                      </td>
                    </tr>
                  ) : shown.length ? (
                    shown.map((s) => (
                      <tr key={s.id || s.tracking_code}>
                        <td>
                          <div className="ship-name">
                            <span><Package size={17} /></span>
                            <div>
                              <strong>
                                {s.description || "Parcel shipment"}
                              </strong>
                              <small>
                                {s.tracking_code ||
                                  `Shipment #${s.id}`}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          {s.origin || "—"} → {s.destination || "—"}
                        </td>

                        <td>
                          <span className={`pill ${cls(s.status)}`}>
                            {label(s.status)}
                          </span>
                        </td>

                        <td>{dateText(s.created_at)}</td>

                        {canManageShipments && (
                          <td>
                            <AgentShipmentActions
                              shipment={s}
                              onUpdated={async () => {
                                await load();
                                setNotice(
                                  `Shipment ${
                                    s.tracking_code || s.id
                                  } updated.`
                                );
                              }}
                            />
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={canManageShipments ? 5 : 4}>
                        <div className="empty">
                          <Package size={25} />
                          <strong>
                            {query || filter !== "ALL"
                              ? "No matching shipments"
                              : "No shipments yet"}
                          </strong>
                          <p>
                            Create a shipment or change your search
                            filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-foot">
              Showing {shown.length} of {shipments.length} shipments
              <span><i /> Synced with API</span>
            </div>
          </section>

          <Tracking />

          <footer>
            Logistics Shipment Tracking System · Logistics Shipment Tracking System ·
            Powered by FastAPI
          </footer>
        </div>
      </main>

     
{modal && role !== "admin" && (
  <CreateModal
    close={() => setModal(false)}
    created={created}
  />
)}

    </div>
  );
}
