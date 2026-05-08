import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Card, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getApiUrl } from '../utils/apiHelper';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const url = getApiUrl('leaderboard');
      console.log('Fetching leaderboard from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Leaderboard data received:', data);
      const leaderboardList = data.results || (Array.isArray(data) ? data : []);
      const sorted = leaderboardList.sort((a, b) => b.points - a.points);
      setLeaderboard(sorted);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredLeaderboard = leaderboard.filter((entry) =>
    entry.user.toLowerCase().includes(search.toLowerCase())
  );

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'warning';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'danger';
    return 'primary';
  };

  const handleShowModal = (entry) => {
    setSelectedEntry(entry);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEntry(null);
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" className="ms-3" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger"><strong>Error:</strong> {error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h1 className="mb-2">🏆 Leaderboard</h1>
              <p className="text-muted">See how your heroes rank across points and performance.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={fetchLeaderboard}>Refresh</Button>
            </Col>
          </Row>
          <Form className="mb-4">
            <Row className="g-3 align-items-center">
              <Col md={8}>
                <Form.Control
                  type="search"
                  placeholder="Search leaderboard by user"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4} className="text-md-end">
                <small className="text-muted">Showing {filteredLeaderboard.length} of {leaderboard.length}</small>
              </Col>
            </Row>
          </Form>

          {filteredLeaderboard.length === 0 ? (
            <Alert variant="info">No leaderboard entries match your search.</Alert>
          ) : (
            <Table striped bordered hover responsive className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th className="text-center" style={{ width: '90px' }}>Rank</th>
                  <th>User</th>
                  <th className="text-center" style={{ width: '120px' }}>Points</th>
                  <th className="text-center" style={{ width: '120px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaderboard.map((entry, idx) => (
                  <tr key={idx} className={idx === 0 ? 'table-warning' : ''}>
                    <td className="text-center">
                      <Badge bg={getRankBadgeColor(idx + 1)} className="fs-6">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </Badge>
                    </td>
                    <td><strong>{entry.user}</strong></td>
                    <td className="text-center"><Badge bg="success" className="fs-5">{entry.points}</Badge></td>
                    <td className="text-center">
                      <Button variant="primary" size="sm" onClick={() => handleShowModal(entry)}>
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
          <Modal.Title>Leaderboard detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEntry ? (
            <>
              <p><strong>User:</strong> {selectedEntry.user}</p>
              <p><strong>Points:</strong> {selectedEntry.points}</p>
              <p><em>Keep pushing to move higher in the rankings!</em></p>
            </>
          ) : (
            <p>No entry selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Leaderboard;
