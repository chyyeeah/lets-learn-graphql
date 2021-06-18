const express = require('express');
const morgan = require('morgan');
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schema/schema.js');

const app = express();
const PORT = 3000;

app.use(morgan('dev'));
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.get('/', (req, res) => res.send('hello'));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));