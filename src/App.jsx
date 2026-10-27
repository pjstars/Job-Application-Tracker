
import { useState, useEffect } from "react";
import "./App.css";

const starterApplications = [
  {
    id: 1,
    company: "Eccalon",
    role: "Junior Software Engineer",
    status: "Applied",
    date: "2026-10-27",
    location: "Michigan",
  },
  {
    id: 2,
    company: "University of Michigan",
    role: "Accessibility Developer",
    status: "Interview",
    date: "2026-10-26",
    location: "Ann Arbor, MI",
  },
  {
    id: 3,
    company: "Creative Tech",
    role: "Frontend Developer",
    status: "Saved",
    date: "2026-10-25",
    location: "Remote",
  },
];

const statuses = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("careerflow-applications");
    return saved ? JSON.parse(saved) : starterApplications;
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    status: "Saved",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    localStorage.setItem(
      "careerflow-applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const updateForm = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const addApplication = (event) => {
    event.preventDefault();

    const newApplication = {
      ...form,
      id: Date.now(),
    };

    setApplications([newApplication, ...applications]);
    setForm({
      company: "",
      role: "",
      location: "",
      status: "Saved",
      date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(false);
  };

  const updateStatus = (id, status) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    );
  };

  const deleteApplication = (id) => {
    if (window.confirm("Delete this application?")) {
      setApplications(applications.filter((app) => app.id !== id));
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || app.status === filter;

    return matchesSearch && matchesFilter;
  });

  const countStatus = (status) =>
    applications.filter((app) => app.status === status).length;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✿</div>
          <span>career<span className="brand-accent">bloom</span></span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <button className="nav-item active">
          <span>▦</span> Dashboard
        </button>
        <button
          className="nav-item"
          onClick={() => setFilter("All")}
        >
          <span>▤</span> Applications
        </button>

        <div className="sidebar-label second-label">YOUR JOURNEY</div>
        {statuses.map((status) => (
          <button
            className="nav-item"
            key={status}
            onClick={() => setFilter(status)}
          >
            <span className="nav-dot" /> {status}
            <span className="nav-count">{countStatus(status)}</span>
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="sidebar-flower">✿</div>
          <p>Little steps lead to big things.</p>
          <span>Your next chapter is waiting.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> Dashboard</div>
          <div className="profile">
            <div className="profile-avatar">P</div>
            <div>
              <strong>My Workspace</strong>
              <small>Job search journey</small>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <div className="eyebrow">YOUR CAREER JOURNEY ✨</div>
            <h1>A little progress goes a <em>long way.</em></h1>
            <p>Keep track of your opportunities and find your next chapter.</p>
          </div>
          <button className="primary-button" onClick={() => setShowForm(!showForm)}>
            <span>＋</span> Add application
          </button>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top"><span>Total applications</span><span className="stat-icon pink">▤</span></div>
            <div className="stat-number">{applications.length}</div>
            <div className="stat-note">Opportunities you're tracking</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>In progress</span><span className="stat-icon lavender">↗</span></div>
            <div className="stat-number">{countStatus("Applied") + countStatus("Interview")}</div>
            <div className="stat-note">Applications moving forward</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Interviews</span><span className="stat-icon peach">♡</span></div>
            <div className="stat-number">{countStatus("Interview")}</div>
            <div className="stat-note">Chances to shine</div>
          </div>
          <div className="stat-card">
            <div className="stat-top"><span>Offers</span><span className="stat-icon green">✧</span></div>
            <div className="stat-number">{countStatus("Offer")}</div>
            <div className="stat-note">New beginnings</div>
          </div>
        </section>

        {showForm && (
          <section className="form-card">
            <div className="section-heading">
              <div>
                <h2>Add an application</h2>
                <p>Every opportunity starts somewhere.</p>
              </div>
              <button className="close-button" onClick={() => setShowForm(false)}>×</button>
            </div>

            <form onSubmit={addApplication} className="application-form">
              <label>
                Company *
                <input name="company" value={form.company} onChange={updateForm} placeholder="e.g. Google" required />
              </label>
              <label>
                Job title *
                <input name="role" value={form.role} onChange={updateForm} placeholder="e.g. Frontend Developer" required />
              </label>
              <label>
                Location
                <input name="location" value={form.location} onChange={updateForm} placeholder="e.g. Remote" />
              </label>
              <label>
                Status
                <select name="status" value={form.status} onChange={updateForm}>
                  {statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
              <label>
                Date
                <input type="date" name="date" value={form.date} onChange={updateForm} required />
              </label>
              <button type="submit" className="primary-button form-submit">Save application</button>
            </form>
          </section>
        )}

        <section className="applications-section">
          <div className="section-heading">
            <div>
              <h2>Your applications</h2>
              <p>All your opportunities, in one place.</p>
            </div>
            <span className="application-count">{filteredApplications.length} applications</span>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search companies or roles..."
              />
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="All">All statuses</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>COMPANY & ROLE</th>
                  <th>LOCATION</th>
                  <th>DATE ADDED</th>
                  <th>STATUS</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div className="company-cell">
                        <div className="company-avatar">
                          {app.company.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{app.company}</strong>
                          <span>{app.role}</span>
                        </div>
                      </div>
                    </td>
                    <td className="muted-cell">{app.location || "—"}</td>
                    <td className="muted-cell">
                      {app.date
                        ? new Date(`${app.date}T12:00:00`).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td>
                      <select
                        className={`status-select status-${app.status.toLowerCase()}`}
                        value={app.status}
                        onChange={(event) => updateStatus(app.id, event.target.value)}
                        aria-label={`Status for ${app.company}`}
                      >
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="delete-button" onClick={() => deleteApplication(app.id)} aria-label={`Delete ${app.company}`}>×</button>
                    </td>
                  </tr>
                ))}
                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No applications found. Try a different search or add one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          Made with care for your next chapter <span>✿</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
