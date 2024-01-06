import { gql } from '@apollo/client';

export const GetTables = gql`
    query {
        tables {
            id
            code
            state
        }
    }
`;