import {Container, Row,Form,FormControl,Button, Navbar,Col} from 'react-bootstrap';
import {LoginForm} from './AuthComponents';
import {CategoryForm} from './CategoryForm';

function CategoryDefault(){
    return(
        <>
        <h1>This Page is Default</h1>
        <h2>This is not the  page you are looking for</h2>
        </>
    );
}

function FormRoute(props){
  console.log(props);
  return(
    <Container fluid className='App'>
    <Row>
      <Col>
        <h1>Enter Category Data</h1>
      </Col>
    </Row>
    <Row >
      <Col>
        <CategoryForm  round={props.round} params={props.params} createRound={props.createRound}  />
      </Col>
    </Row>
  </Container>
  )

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

  export{CategoryDefault, LoginRoute, FormRoute};