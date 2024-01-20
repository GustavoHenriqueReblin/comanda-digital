import { gql } from '@apollo/client';

export const CHANGE_TABLE_STATUS = gql`
    subscription ChangeTableStatus {
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