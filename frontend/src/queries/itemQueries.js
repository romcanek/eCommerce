import { gql } from "@apollo/client";

const GET_ITEMS = gql`
    query getItems {
        items {
            id
            name
            price
            description
            inStock
            img
        }
    }
`;

const GET_ITEM = gql`
    query getItem($id: ID!) {
        item(id: $id) {
            id
            name
            price
            description
            inStock
            img
        }
    }
`;

export { GET_ITEMS, GET_ITEM };
