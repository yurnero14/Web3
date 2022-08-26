import {Container, Row,Form,FormControl,Button, Navbar,Col} from 'react-bootstrap';
import {LoginForm} from './AuthComponents';

function CategoryDefault(){
    return(
        <>
        <h1>This Page is Default</h1>
        <h2>This is not the  page you are looking for</h2>
        </>
    );
}

function LoginRoute(props) {
    return(
      <>
        <Row>
          <Col>
            <h1>Login</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <LoginForm login={props.login} />
          </Col>
        </Row>
      </>
    );
  }

  export{CategoryDefault, LoginRoute};