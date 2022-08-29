import { useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";

const CreateRoundForm = () => {
    const handleSubmit = (event) => {
      event.preventDefault();
    }
  
    return (
      <Form className="border border-primary rounded form-padding" onSubmit={handleSubmit}>
        <FormGroup className='mb-3'>
          <Form.Label>Category</Form.Label>
          <Form.Select aria-label='Category'>
            <option value="animals">Animals</option>
            <option value="countries">Countries</option>
            <option value="colors">Colors</option>
          </Form.Select>
        </FormGroup>
        
        <FormGroup className='mb-3'>
          <Form.Label>Difficulty</Form.Label>
          <Form.Select aria-label='Difficulty'>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Form.Select>
        </FormGroup>
        <Link to={'/responseForm'}>
          <Button className="mb-3" variant="primary" type="submit">Create</Button>
        </Link>
        &nbsp;
        <Link to={'/'}> 
          <Button className="mb-3" variant="danger" >Cancel</Button>
        </Link>
      </Form>
    )
  }

export default CreateRoundForm;
