import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Home() {
  return (
    <Container className="mt-4 mb-5">
      <Card className="shadow-sm border-0 home-card">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-5 fw-bold">Welcome to OctoFit Tracker</h1>
              <p className="lead text-muted">
                Track your fitness activities, compare team performance, and stay motivated with your superhero squad.
              </p>
              <Button as={Link} to="/activities" variant="primary" size="lg">
                View Activities
              </Button>
            </Col>
            <Col md={4} className="text-center mt-4 mt-md-0">
              <img src="/octofitapp-small.svg" alt="OctoFit logo" className="img-fluid home-hero" />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}

function App() {
  console.log('App loaded, REACT_APP_CODESPACE_NAME:', process.env.REACT_APP_CODESPACE_NAME);

  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-heading d-flex align-items-center">
            <img src="/octofitapp-small.svg" alt="OctoFit logo" className="app-logo me-2" />
            OctoFit Tracker
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto nav-links">
              <Nav.Link as={Link} to="/users">Users</Nav.Link>
              <Nav.Link as={Link} to="/teams">Teams</Nav.Link>
              <Nav.Link as={Link} to="/activities">Activities</Nav.Link>
              <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
              <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}

export default App;
