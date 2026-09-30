import "./App.css";

function App() {
  return (
    <div className="dashboard">

      {/* Header */}
      <header>
        <div className="menu">☰</div>

        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, Admin!</p>
        </div>

        <div className="icons">
          🔔 👤
        </div>
      </header>


      {/* Statistics */}
      <div className="cards">

        <div className="card">
          <div className="icon blue">👥</div>
          <h2>1,248</h2>
          <p>Total Users</p>
        </div>

        <div className="card">
          <div className="icon green">⛽</div>
          <h2>86</h2>
          <p>Stations</p>
        </div>

        <div className="card">
          <div className="icon orange">📄</div>
          <h2>42</h2>
          <p>Requests</p>
        </div>

        <div className="card">
          <div className="icon purple">🎧</div>
          <h2>18</h2>
          <p>Support Tickets</p>
        </div>

      </div>


      {/* Requests */}
      <section className="box">

        <div className="title">
          <h2>Recent Requests</h2>
          <a>View All</a>
        </div>

        <div className="request">
          <span>#1023</span>
          <span>Ali Mohamed</span>
          <span>Tripoli Station</span>
          <span>Diesel</span>
          <span>120 L</span>
          <b className="pending">Pending</b>
        </div>

        <div className="request">
          <span>#1022</span>
          <span>Mohamed Ali</span>
          <span>Benghazi Station</span>
          <span>Petrol</span>
          <span>80 L</span>
          <b className="approved">Approved</b>
        </div>

        <div className="request">
          <span>#1021</span>
          <span>Sara Ahmed</span>
          <span>Misrata Station</span>
          <span>Diesel</span>
          <span>200 L</span>
          <b className="pending">Pending</b>
        </div>

        <div className="request">
          <span>#1020</span>
          <span>Omar Hassan</span>
          <span>Zawiya Station</span>
          <span>Petrol</span>
          <span>60 L</span>
          <b className="rejected">Rejected</b>
        </div>

      </section>


      {/* Stations and Users */}
      <div className="two-boxes">

        <section className="box">
          <div className="title">
            <h2>Stations</h2>
            <a>View All</a>
          </div>

          <p>📍 Tripoli Station <b className="approved">Active</b></p>
          <p>📍 Benghazi Station <b className="approved">Active</b></p>
          <p>📍 Misrata Station <b className="rejected">Inactive</b></p>
          <p>📍 Zawiya Station <b className="approved">Active</b></p>
        </section>


        <section className="box">
          <div className="title">
            <h2>Users</h2>
            <a>View All</a>
          </div>

          <p>👤 Ali Mohamed <b className="approved">Active</b></p>
          <p>👤 Sara Ahmed <b className="approved">Active</b></p>
          <p>👤 Mohamed Ali <b className="approved">Active</b></p>
          <p>👤 Omar Hassan <b className="rejected">Inactive</b></p>
        </section>

      </div>


      {/* Notifications */}
      <section className="box">

        <div className="title">
          <h2>Notifications</h2>
          <a>View All</a>
        </div>

        <p>🔔 New request submitted by Ali Mohamed</p>
        <p>🔔 Station Benghazi Station has been updated</p>
        <p>🔔 New user registered: Sara Ahmed</p>
        <p>🔔 Request #1021 has been approved</p>

      </section>


      {/* Bottom Navigation */}
      <nav>
        <div>ⓘ<small>About</small></div>
        <div>⌂<small>Home</small></div>
        <div>👤<small>Account</small></div>
      </nav>

    </div>
  );
}

export default App;