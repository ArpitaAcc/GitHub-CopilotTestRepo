import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Card, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getApiUrl } from '../utils/apiHelper';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const url = getApiUrl('activities');
      console.log('Fetching activities from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Activities data received:', data);
      const activitiesList = data.results || (Array.isArray(data) ? data : []);
      setActivities(activitiesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredActivities = activities.filter((activity) =>
    `${activity.user} ${activity.activity}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" className="ms-3" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger"><strong>Error:</strong> {error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h1 className="mb-2">Activities</h1>
              <p className="text-muted">Browse all fitness sessions from your OctoFit teams.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={fetchActivities}>Refresh</Button>
            </Col>
          </Row>
          <Form className="mb-4">
            <Row className="g-3 align-items-center">
              <Col md={8}>
                <Form.Control
                  type="search"
                  placeholder="Search activities by user or type"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4} className="text-md-end">
                <small className="text-muted">Showing {filteredActivities.length} of {activities.length}</small>
              </Col>
            </Row>
          </Form>

          {filteredActivities.length === 0 ? (
            <Alert variant="info">No activities found. Try adjusting your search.</Alert>
          ) : (
            <Table striped bordered hover responsive className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Activity</th>
                  <th className="text-center">Duration</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredActivities.map((activity, idx) => (
                  <tr key={idx}>
                    <td><strong>{activity.user}</strong></td>
                    <td>{activity.activity}</td>
                    <td className="text-center"><Badge bg="success">{activity.duration} min</Badge></td>
                    <td className="text-center">
                      <Button variant="primary" size="sm" onClick={() => handleShowModal(activity)}>
                        View Details
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
          <Modal.Title>Activity details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedActivity ? (
            <>
              <p><strong>User:</strong> {selectedActivity.user}</p>
              <p><strong>Activity:</strong> {selectedActivity.activity}</p>
              <p><strong>Duration:</strong> {selectedActivity.duration} minutes</p>
            </>
          ) : (
            <p>No activity selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Activities;
