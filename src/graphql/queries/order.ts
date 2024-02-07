import { gql } from '@apollo/client';

export const GetOrder = gql`
    query Order($input: OrderIdInput) {
        order(input: $input) {
        id
        bartenderId
        bertenderName
        tableId
        tableCode
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
    }
`;


