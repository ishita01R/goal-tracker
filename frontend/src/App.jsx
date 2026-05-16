import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function getGoals() {
  return JSON.parse(localStorage.getItem("submittedGoals")) || [];
}

function getStatus() {
  return localStorage.getItem("goalStatus") || "Pending";
}

function Login() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#1e293b,#312e81)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "40px",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#a5b4fc",
              fontWeight: "700",
              letterSpacing: "2px",
            }}
          >
            ENTERPRISE PERFORMANCE PLATFORM
          </p>

          <h1
            style={{
              color: "white",
              fontSize: "72px",
              lineHeight: "1",
              marginBottom: "20px",
            }}
          >
            GoalBridge
          </h1>

          <p
            style={{
              color: "#cbd5e1",
              fontSize: "22px",
              lineHeight: "1.6",
              maxWidth: "550px",
            }}
          >
            Smart enterprise goal alignment, quarterly check-ins, approval
            workflows, analytics dashboards and audit-ready performance
            tracking.
          </p>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginTop: "35px",
              flexWrap: "wrap",
            }}
          >
            <div className="glass-pill">FY 2026 Goal Cycle</div>
            <div className="glass-pill">Real-time Approval Flow</div>
            <div className="glass-pill">Audit Analytics</div>
          </div>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(18px)",
            borderRadius: "30px",
            padding: "45px",
            boxShadow: "0 25px 50px rgba(0,0,0,0.35)",
          }}
        >
          <h2
            style={{
              color: "white",
              fontSize: "34px",
              marginBottom: "10px",
            }}
          >
            Access Portals
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              marginBottom: "35px",
            }}
          >
            Secure role-based enterprise access
          </p>

          <button className="portal-btn purple" onClick={() => navigate("/employee")}>
            Employee Portal
          </button>

          <button className="portal-btn blue" onClick={() => navigate("/manager")}>
            Manager Portal
          </button>

          <button className="portal-btn green" onClick={() => navigate("/admin")}>
            Admin / HR Portal
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [weight, setWeight] = useState("");
  const [uom, setUom] = useState("");
  const [achievement, setAchievement] = useState("");
  const [progressStatus, setProgressStatus] = useState("On Track");

  const [goals, setGoals] = useState([]);

  const submittedGoals = getGoals();
  const status = getStatus();

  const totalWeight = goals.reduce((sum, g) => sum + Number(g.weight), 0);

  const addGoal = () => {
    if (!title || !target || !weight || !uom) {
      alert("Fill all fields");
      return;
    }

    if (Number(weight) < 10) {
      alert("Minimum weightage is 10%");
      return;
    }

    if (goals.length >= 8) {
      alert("Maximum 8 goals allowed");
      return;
    }

    if (totalWeight + Number(weight) > 100) {
      alert("Total weightage cannot exceed 100%");
      return;
    }

    setGoals([
      ...goals,
      {
        title,
        target,
        weight,
        uom,
        owner: "Riya Sharma",
        department: "Sales",
      },
    ]);

    setTitle("");
    setTarget("");
    setWeight("");
    setUom("");
  };

  const submitGoals = () => {
    if (totalWeight !== 100) {
      alert("Total weightage must be exactly 100%");
      return;
    }

    localStorage.setItem("submittedGoals", JSON.stringify(goals));
    localStorage.setItem("goalStatus", "Pending");
    localStorage.setItem(
      "auditLog",
      JSON.stringify([
        "Employee submitted goals for manager approval",
        "System validated total weightage = 100%",
      ])
    );

    alert("Goals submitted successfully");
    window.location.reload();
  };

  const submitCheckin = () => {
    if (!achievement) {
      alert("Enter achievement first");
      return;
    }

    localStorage.setItem(
      "checkin",
      JSON.stringify({
        quarter: "Q1",
        achievement,
        progressStatus,
      })
    );

    alert("Quarterly check-in submitted");
    window.location.reload();
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="nav">
        <div>
          <h1>Employee Dashboard</h1>
          <p className="small">
            FY 2026 Goal Cycle • Sales Department • Riya Sharma
          </p>
        </div>

        <span className={`badge ${status === "Approved" ? "approved" : "pending"}`}>
          {status}
        </span>
      </div>

      <div className="grid">
        <div className="card kpi">
          <h2>{submittedGoals.length || goals.length}</h2>
          <p>Total Goals</p>
        </div>

        <div className="card kpi">
          <h2>{totalWeight}%</h2>
          <p>Draft Weightage</p>
        </div>

        <div className="card kpi">
          <h2>{status === "Approved" ? "Locked" : "Editable"}</h2>
          <p>Goal Sheet State</p>
        </div>
      </div>

      <div className="card form-card">
        <h2>Create Goal Sheet</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Goal Title"
          disabled={status === "Approved"}
        />

        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target"
          disabled={status === "Approved"}
        />

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weightage %"
          disabled={status === "Approved"}
        />

        <select
          value={uom}
          onChange={(e) => setUom(e.target.value)}
          disabled={status === "Approved"}
        >
          <option value="">Select UoM</option>
          <option>Numeric</option>
          <option>%</option>
          <option>Timeline</option>
          <option>Zero</option>
        </select>

        <button onClick={addGoal}>Add Goal</button>
        <button onClick={submitGoals}>Submit Goals</button>
        <button className="danger-btn" onClick={resetData}>
          Reset Demo
        </button>
      </div>

      <div className="card form-card">
        <h2>My Draft Goals</h2>

        {goals.length === 0 ? (
          <p className="small">No draft goals added yet.</p>
        ) : (
          goals.map((goal, index) => (
            <div className="goal-card" key={index}>
              <h3>{goal.title}</h3>
              <p>Target: {goal.target}</p>
              <p>Weightage: {goal.weight}%</p>
              <p>UoM: {goal.uom}</p>
            </div>
          ))
        )}
      </div>

      {status === "Approved" && (
        <div className="card form-card">
          <h2>Quarterly Check-in — Q1</h2>

          <input
            type="number"
            placeholder="Actual Achievement"
            value={achievement}
            onChange={(e) => setAchievement(e.target.value)}
          />

          <select
            value={progressStatus}
            onChange={(e) => setProgressStatus(e.target.value)}
          >
            <option>Not Started</option>
            <option>On Track</option>
            <option>Completed</option>
          </select>

          <button onClick={submitCheckin}>Submit Check-in</button>
        </div>
      )}
    </div>
  );
}

function ManagerDashboard() {
  const goals = getGoals();
  const checkin = JSON.parse(localStorage.getItem("checkin"));
  const [comment, setComment] = useState("");

  const approveGoals = () => {
    localStorage.setItem("goalStatus", "Approved");

    const logs = JSON.parse(localStorage.getItem("auditLog")) || [];
    logs.push("Manager approved and locked employee goal sheet");
    localStorage.setItem("auditLog", JSON.stringify(logs));

    alert("Goals approved and locked");
    window.location.reload();
  };

  const saveComment = () => {
    localStorage.setItem("managerComment", comment);

    const logs = JSON.parse(localStorage.getItem("auditLog")) || [];
    logs.push("Manager added quarterly check-in feedback");
    localStorage.setItem("auditLog", JSON.stringify(logs));

    alert("Manager comment saved");
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="nav">
        <div>
          <h1>Manager Dashboard</h1>
          <p className="small">Ankit Mehra • L1 Manager • Sales Team</p>
        </div>

        <span className="badge locked">Approval Panel</span>
      </div>

      <div className="grid">
        <div className="card kpi">
          <h2>{goals.length}</h2>
          <p>Submitted Goals</p>
        </div>

        <div className="card kpi">
          <h2>{getStatus()}</h2>
          <p>Approval Status</p>
        </div>

        <div className="card kpi">
          <h2>{checkin ? "Done" : "Pending"}</h2>
          <p>Q1 Check-in</p>
        </div>
      </div>

      <div className="card form-card">
        <h2>Employee Goal Sheet</h2>

        {goals.length === 0 ? (
          <p>No goals submitted yet.</p>
        ) : (
          goals.map((goal, index) => (
            <div className="goal-card" key={index}>
              <h3>{goal.title}</h3>
              <p>Owner: {goal.owner}</p>
              <p>Target: {goal.target}</p>
              <p>Weightage: {goal.weight}%</p>
              <p>UoM: {goal.uom}</p>
            </div>
          ))
        )}

        <button onClick={approveGoals}>Approve & Lock Goals</button>
      </div>

      <div className="card form-card">
        <h2>Manager Check-in Feedback</h2>

        {checkin ? (
          <>
            <p>Quarter: {checkin.quarter}</p>
            <p>Actual Achievement: {checkin.achievement}</p>
            <p>Status: {checkin.progressStatus}</p>
          </>
        ) : (
          <p className="small">Employee has not submitted check-in yet.</p>
        )}

        <textarea
          placeholder="Add structured manager feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={saveComment}>Save Feedback</button>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const goals = getGoals();
  const checkin = JSON.parse(localStorage.getItem("checkin"));
  const logs = JSON.parse(localStorage.getItem("auditLog")) || [];
  const managerComment = localStorage.getItem("managerComment");

  const exportReport = () => {
    const report = `
Employee,Department,Goals,Status,Q1 Check-in,Manager Comment
Riya Sharma,Sales,${goals.length},${getStatus()},${checkin ? "Completed" : "Pending"},${managerComment || "Not added"}
`;

    const blob = new Blob([report], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "achievement_report.csv";
    a.click();
  };

  return (
    <div className="container">
      <h1>GoalBridge Admin Console</h1>
      <p className="small">
        Central governance, audit trail and completion visibility
      </p>

      <div className="grid">
        <div className="card kpi">
          <h2>{goals.length}</h2>
          <p>Total Goals Submitted</p>
        </div>

        <div className="card kpi">
          <h2>{getStatus()}</h2>
          <p>Goal Approval Status</p>
        </div>

        <div className="card kpi">
          <h2>{checkin ? "100%" : "0%"}</h2>
          <p>Q1 Completion</p>
        </div>

        <div className="card kpi">
          <h2>{logs.length}</h2>
          <p>Audit Events</p>
        </div>
      </div>

      <div className="card form-card">
        <h2>Analytics Snapshot</h2>

        <p>Goal Distribution: Sales / Numeric / Percentage Based</p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: checkin ? "100%" : "35%" }}
          ></div>
        </div>

        <p className="small">
          Completion dashboard showing quarterly progress visibility.
        </p>

        <button onClick={exportReport}>Export CSV Report</button>
      </div>

      <div className="card form-card">
        <h2>Audit Trail</h2>

        {logs.length === 0 ? (
          <p>No audit events yet.</p>
        ) : (
          logs.map((log, index) => (
            <div className="audit" key={index}>
              {index + 1}. {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;