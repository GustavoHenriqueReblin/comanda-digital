import { gql } from '@apollo/client';

export const CREATE_ORDER = gql`
    mutation Mutation($input: OrderInput!) {
        createOrder(input: $input) {
            data {
                id
                bartenderId
                tableId
                value
                date
                status
                items {
                    id
                    orderId
                    productId
                    value
                    status
                }
            }
            message
        }
    }
`;