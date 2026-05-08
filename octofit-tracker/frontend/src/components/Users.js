import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner, Card, Badge, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { getApiUrl } from '../utils/apiHelper';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const url = getApiUrl('users');
      console.log('Fetching users from:', url);

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users data received:', data);
      const usersList = data.results || (Array.isArray(data) ? data : []);
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.team}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" className="ms-3" /></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger"><strong>Error:</strong> {error}</Alert></Container>;

  return (
    <Container className="mt-4 mb-4">
      <Card className="shadow-sm">
        <Card.Body>
          <Row className="align-items-center mb-3">
            <Col md={8}>
              <h1 className="mb-2">Users</h1>
              <p className="text-muted">Review your registered heroes and their teams.</p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button variant="outline-primary" onClick={fetchUsers}>Refresh</Button>
            </Col>
          </Row>
          <Form className="mb-4">
            <Row className="g-3 align-items-center">
              <Col md={8}>
                <Form.Control
                  type="search"
                  placeholder="Search users by name, email, or team"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Col>
              <Col md={4} className="text-md-end">
                <small className="text-muted">Showing {filteredUsers.length} of {users.length}</small>
              </Col>
            </Row>
          </Form>

          {filteredUsers.length === 0 ? (
            <Alert variant="info">No users match your search query.</Alert>
          ) : (
            <Table striped bordered hover responsive className="mb-0 align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th className="text-center">Team</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, idx) => (
                  <tr key={idx}>
                    <td><strong>{user.name}</strong></td>
                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                    <td className="text-center"><Badge bg="primary">{user.team}</Badge></td>
                    <td className="text-center">
                      <Button variant="primary" size="sm" onClick={() => handleShowModal(user)}>
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
          <Modal.Title>User details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> <a href={`mailto:${selectedUser.email}`}>{selectedUser.email}</a></p>
              <p><strong>Team:</strong> {selectedUser.team}</p>
            </>
          ) : (
            <p>No user selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users;
