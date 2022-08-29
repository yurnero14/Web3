import React from 'react'
import { Table } from 'react-bootstrap'

const HallOfFame = (props) => {
  console.log(props)
  return (
    <>
    <h1>Hall Of Fame</h1>
    <p>The Leaders of Each Category</p>
    <Table striped bordered>
      <thead>
        <tr>
          <th>🏆</th>
          <th>Category</th>
          <th>User</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>🐅</td>
          <td>Animals</td>
          <td>{props.leaders.animalsLeader.name}</td>
          <td>{props.leaders.animalsLeader.score}</td>
        </tr>
        <tr>
          <td>🌈</td>
          <td>Colors</td>
          <td>{props.leaders.colorsLeader.name}</td>
          <td>{props.leaders.colorsLeader.score}</td>
        </tr>
        <tr>
          <td>🌎</td>
          <td>Countries</td>
          <td>{props.leaders.countriesLeader.name}</td>
          <td>{props.leaders.countriesLeader.score}</td>
        </tr>
      </tbody>
    </Table>
  </>
  )
}

export default HallOfFame