import { gql } from '@apollo/client';

export const GetUsers = gql`
    query {
        users {
            id
            username
            password
            token
        }
    }
`;