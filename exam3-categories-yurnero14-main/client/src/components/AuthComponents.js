import { useState } from "react";
import { Form, Button, Row, Alert,  Col } from "react-bootstrap";

function LoginForm(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { email, password };

    props.login(credentials);
  };

  return (
    <Form onSubmit={handleSubmit}>
        <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
          </Alert>
      <Form.Group controlId="email">
        <Form.Label>email</Form.Label>
        <Form.Control
          type="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required={true}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required={true}
          minLength={6}
        />
      </Form.Group>

      <Button type="submit">Login</Button>
    </Form>
  );
}

function LogoutButton(props) {
  return (
    <Row>
      <Col>
        <Button variant="outline-primary" onClick={props.logout}>
          Logout
        </Button>
      </Col>
    </Row>
  );
}

export {LoginForm, LogoutButton};
