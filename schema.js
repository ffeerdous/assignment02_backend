const { gql } = require('apollo-server-express');

const typeDefs1 = gql `
    type Employee {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        gender: String!
        city: String!
        designation: String!
        salary: Float!
    }

    type Query {
        getEmployees: [Employee]
        getEmployeeByID(id: ID!): Employee
        getEmployeeByGender(gender: String!): [Employee]
        getEmployeeByEmail(email: String!): Employee
    }

    type Mutation {
        addEmployee(firstname: String!
            lastname: String!
            email: String!
            gender: String!
            city: String!
            designation: String!
            salary: Float!): Employee

        updateEmployee(
            email: String!
            firstname: String!
            lastname: String!
            gender: String!
            city: String!
            designation: String!
            salary: Float!): Employee
        
        deleteEmployee(email: String!): Employee
    }
`;

const typeDefs2 = gql `
    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
    }

    type AuthPayload {
        user: User!
    }

    type Query {
        login(username: String!, password: String!): AuthPayload
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): AuthPayload
    }
`;

const typeDefs = [typeDefs1, typeDefs2];
module.exports = typeDefs;