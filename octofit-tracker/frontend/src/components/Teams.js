import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Card, Badge, Button, Modal, Form } from 'react-bootstrap';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const codespace = process.env.REACT_APP_CODESPACE_NAME;
      const protocol = codespace ? 'https' : 'http';
      const host = codespace ? `${codespace}-8000.app.github.dev` : 'localhost:8000';
      const url = `${protocol}://${host}/api/teams/`;
      console.log('Fetching teams from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Teams data received:', data);
      const teamsList = data.results || (Array.isArray(data) ? data : []);
      setTeams(teamsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (team) => {
    setSelectedTeam(team);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTeam(null);
  };

  const getTeamColor = (idx) => {
    const colors = ['primary', 'danger', 'success', 'warning', 'info'];
    return colors[idx % colors.length];
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" className="ms-3" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger"><strong>Error:</strong> {error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h1 className="mb-2">Teams</h1>
              <p className="text-muted">Explore your OctoFit teams and open details for each one.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={fetchTeams}>Refresh</Button>
            </Col>
          </Row>
          <Form className="mb-4">
            <Form.Control
              type="search"
              placeholder="Search team names"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>

          {filteredTeams.length === 0 ? (
            <Alert variant="info">No teams found. Try another search.</Alert>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredTeams.map((team, idx) => (
                <Col key={idx}>
                  <Card className="shadow-sm h-100 border-0 team-card">
                    <Card.Body className={`bg-${getTeamColor(idx)} bg-opacity-10`}> 
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <Card.Title className="mb-2 fs-5">{team.name}</Card.Title>
                          <Card.Text className="text-muted">A superhero squad built for OctoFit challenges.</Card.Text>
                        </div>
                        <Badge bg={getTeamColor(idx)}>Team</Badge>
                      </div>
                      <Button variant="primary" size="sm" onClick={() => handleShowModal(team)}>
                        View Details
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Team details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTeam ? (
            <>
              <p><strong>Team:</strong> {selectedTeam.name}</p>
              <p><em>Keep this team energized and ready for competition.</em></p>
            </>
          ) : (
            <p>No team selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Teams;
