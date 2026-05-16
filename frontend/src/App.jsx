import { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    if (role === "employee") navigate("/employee");
    if (role === "manager") navigate("/manager");
    if (role === "admin") navigate("/admin");
  };

  return (
    <div className="container">

      <h1>Goal Tracker Portal</h1>

      <h2>Select Role</h2>

      <button onClick={() => handleLogin("employee")}>
        Employee Login
      </button>

      <br /><br />

      <button onClick={() => handleLogin("manager")}>
        Manager Login
      </button>

      <br /><br />

      <button onClick={() => handleLogin("admin")}>
        Admin Login
      </button>

    </div>
  );
}

function EmployeeDashboard() {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [weight, setWeight] = useState("");
  const [uom, setUom] = useState("");

  const [goals, setGoals] = useState([]);

  const status = localStorage.getItem("goalStatus");

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

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

    const totalWeight =
      goals.reduce(
        (sum, goal) => sum + Number(goal.weight),
        0
      ) + Number(weight);

    if (totalWeight > 100) {
      alert("Total weightage cannot exceed 100%");
      return;
    }

    const newGoal = {
      title,
      target,
      weight,
      uom
    };

    setGoals([...goals, newGoal]);

    setTitle("");
    setTarget("");
    setWeight("");
    setUom("");
  };

  const submitGoals = () => {

    const total =
      goals.reduce(
        (sum, g) => sum + Number(g.weight),
        0
      );

    if (total !== 100) {
      alert("Total must equal exactly 100%");
      return;
    }

    localStorage.setItem(
      "submittedGoals",
      JSON.stringify(goals)
    );

    localStorage.setItem(
      "goalStatus",
      "Pending"
    );

    alert("Goals submitted");

    window.location.reload();
  };

  return (

    <div className="container">

      <h1>Employee Dashboard</h1>

      <h3 className="status">
        Status: {status || "Pending"}
      </h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal Title"
      />

      <br />

      <input
        type="number"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        placeholder="Target"
      />

      <br />

      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Weightage"
      />

      <br />

      <select
        value={uom}
        onChange={(e) => setUom(e.target.value)}
      >
        <option value="">
          Select UoM
        </option>

        <option>Numeric</option>
        <option>%</option>
        <option>Timeline</option>
        <option>Zero</option>
      </select>

      <br />

      <button onClick={addGoal}>
        Add Goal
      </button>

      <button
        onClick={submitGoals}
      >
        Submit Goals
      </button>

      <button
        onClick={resetData}
      >
        Reset
      </button>

      <hr />

      <h3>
        Total Weight:
        {
          goals.reduce(
            (sum, g) =>
              sum + Number(g.weight),
            0
          )
        }
        %
      </h3>

      {
        goals.map((goal, index) => (

          <div
            key={index}
            className="goalCard"
          >

            <h3>{goal.title}</h3>

            Target: {goal.target}

            <br />

            Weight: {goal.weight}

            <br />

            UoM: {goal.uom}

          </div>

        ))
      }

    </div>

  );
}

function ManagerDashboard() {

  const goals =
    JSON.parse(
      localStorage.getItem(
        "submittedGoals"
      )
    ) || [];

  const approveGoals = () => {

    localStorage.setItem(
      "goalStatus",
      "Approved"
    );

    alert("Goals Approved");

    window.location.reload();
  };

  return (

    <div className="container">

      <h1>Manager Dashboard</h1>

      <h2>Submitted Goals</h2>

      {
        goals.length === 0 ?

          <p>No goals submitted</p>

          :

          goals.map(
            (goal, index) => (

              <div
                key={index}
                className="goalCard"
              >

                <h3>{goal.title}</h3>

                Target: {goal.target}

                <br />

                Weight: {goal.weight}

                <br />

                UoM: {goal.uom}

              </div>

            ))
      }

      <button
        onClick={approveGoals}
      >
        Approve Goals
      </button>

    </div>

  );
}

function AdminDashboard() {
  return (

    <div className="container">

      <h1>Admin Dashboard</h1>

      <h2>System Overview</h2>

      <p>
        Employee Goal Tracker Running Successfully
      </p>

    </div>

  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/employee"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/manager"
          element={<ManagerDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;