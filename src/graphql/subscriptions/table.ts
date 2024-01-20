import { gql } from '@apollo/client';

export const CHANGE_TABLE_STATUS = gql`
    subscription {
        ChangeTableStatus {
            data {
                code
                id
                state
            }
            message
        }
    }
`;