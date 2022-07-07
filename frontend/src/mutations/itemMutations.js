import { gql } from "@apollo/client";

const ADD_ITEM = gql`
    mutation addItem(
        $name: String!
        $price: String!
        $description: String!
        $img: String!
        $inStock: String!
    ) {
        addItem(
            name: $name
            price: $price
            description: $description
            img: $img
            inStock: $inStock
        ) {
            id
            name
            price
            description
            img
            inStock
        }
    }
`;

const BUY_ITEM = gql`
    mutation buyItem($id: ID!, $userId: ID!) {
        buyItem(id: $id, userId: $userId) {
            id
            name
            price
            description
            img
            inStock
        }
    }
`;

const DELETE_BOUGHT_ITEM = gql`
    mutation deleteBoughtItem($id: ID!, $userId: ID!) {
        deleteBoughtItem(id: $id, userId: $userId) {
            id
            name
            price
            description
            img
            inStock
        }
    }
`;

const DELETE_ALL_BOUGHT_ITEMS = gql`
    mutation deleteAllBoughtItems($userId: ID!) {
        deleteAllBoughtItems(userId: $userId) {
            id
        }
    }
`;

export { ADD_ITEM, BUY_ITEM, DELETE_BOUGHT_ITEM, DELETE_ALL_BOUGHT_ITEMS };
