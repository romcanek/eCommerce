import { gql } from "@apollo/client";

const ADD_USER = gql`
    mutation addUser($name: String!, $email: String!, $password: String!) {
        addUser(name: $name, email: $email, password: $password) {
            id
            name
            email
            password
        }
    }
`;

export { ADD_USER };
