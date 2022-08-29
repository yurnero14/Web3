import { useEffect, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";

const ResponseForm = (props) => {
  const [timer, setTimer]=useState(60) // set max time for riddle here
  const [showForm, setShowForm]=useState(true)
     const handleSubmit = (event) => {
      event.preventDefault();
      Navigate('/responseForm')
    }
    useEffect(()=>{
      if(timer>0){
        setTimeout(()=>{
          setTimer(timer-1)
        },1000)
      }else{
        setShowForm(false)
      }
    },[timer])
    return (
      <Form className="border border-primary rounded form-padding" onSubmit={handleSubmit}>
        <div>
          Time Left: {timer}
        </div>  
        {showForm?<>
          <FormGroup className='mb-3'>
            <Form.Label>Enter Your Response Here. The answers should be comma separated and without spaces</Form.Label>
            <Form.Control placeholder="apple,banana,mango" type='text' required={true} onClick={()=>{}}/>
          </FormGroup>
            
      
          <Button className="mb-3" variant="primary" type="submit">Submit</Button>
          &nbsp;
          <Link to={'/'}> 
            <Button className="mb-3" variant="danger" >Cancel</Button>
          </Link>
        </>:'Time Over'}
      </Form>
    )
  }

export default ResponseForm;
