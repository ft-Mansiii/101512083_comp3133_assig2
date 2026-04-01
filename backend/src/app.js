require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const { typeDefs } = require("./graphql/typeDefs");
const { resolvers } = require("./graphql/resolvers");
const { validateGraphQL } = require("./validation/graphqlValidation");

// ensure models are registered
require("./models/User");
require("./models/Employee");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Employee Management API is up - use /graphql for GraphQL endpoint");
});

// build GraphQL schema from SDL string
const schema = buildSchema(typeDefs);

// Validation middleware (express-validator)
app.use("/graphql", validateGraphQL);

// GraphQL endpoint + GraphiQL
app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: { req }
  }))
);

module.exports = app;
