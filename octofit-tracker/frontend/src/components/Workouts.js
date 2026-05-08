import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Card, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getApiUrl } from '../utils/apiHelper';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const url = getApiUrl('workouts');
      console.log('Fetching workouts from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Workouts data received:', data);
      const workoutsList = data.results || (Array.isArray(data) ? data : []);
      setWorkouts(workoutsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredWorkouts = workouts.filter((workout) =>
    `${workout.user} ${workout.workout}`.toLowerCase().includes(search.toLowerCase())
  );

  const getRepBadgeColor = (reps) => {
    if (reps >= 50) return 'danger';
    if (reps >= 30) return 'warning';
    return 'success';
  };

  const handleShowModal = (workout) => {
    setSelectedWorkout(workout);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWorkout(null);
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" className="ms-3" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger"><strong>Error:</strong> {error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h1 className="mb-2">💪 Workouts</h1>
              <p className="text-muted">Review workout performance and open details for each entry.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={fetchWorkouts}>Refresh</Button>
            </Col>
          </Row>
          <Form className="mb-4">
            <Row className="g-3 align-items-center">
              <Col md={8}>
                <Form.Control
                  type="search"
                  placeholder="Search workouts by user or exercise"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4} className="text-md-end">
                <small className="text-muted">Showing {filteredWorkouts.length} of {workouts.length}</small>
              </Col>
            </Row>
          </Form>

          {filteredWorkouts.length === 0 ? (
            <Alert variant="info">No workouts found matching your query.</Alert>
          ) : (
            <Table striped bordered hover responsive className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Workout</th>
                  <th className="text-center">Reps</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkouts.map((workout, idx) => (
                  <tr key={idx}>
                    <td><strong>{workout.user}</strong></td>
                    <td>{workout.workout}</td>
                    <td className="text-center"><Badge bg={getRepBadgeColor(workout.reps)} className="fs-5">{workout.reps}</Badge></td>
                    <td className="text-center">
                      <Button variant="primary" size="sm" onClick={() => handleShowModal(workout)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Workout details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorkout ? (
            <>
              <p><strong>User:</strong> {selectedWorkout.user}</p>
              <p><strong>Workout:</strong> {selectedWorkout.workout}</p>
              <p><strong>Reps:</strong> {selectedWorkout.reps}</p>
              <p><em>Keep pushing to reach new fitness goals.</em></p>
            </>
          ) : (
            <p>No workout selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Workouts;
