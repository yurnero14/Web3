import React from 'react'
import { Table } from 'react-bootstrap'

const MyScore = (props) => {
  return (
    <>
    <p>{`${props.user.name}'s Scores for Each Category`}</p>
    <Table striped bordered>
      <thead>
        <tr>
          <th>Animals</th>
          <th>Colors</th>
          <th>Countries</th>
        </tr>
      </thead>
      <tbody>
        <td>{props.score.animals}</td>
        <td>{props.score.colors}</td>
        <td>{props.score.countries}</td>
      </tbody>
    </Table>
  </>
  )
}

export default MyScore