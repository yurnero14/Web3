'use strict';

const express = require('express');

// init express
const app = new express();
const port = 3001;
const nothing; 
// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});