import { gql } from '@apollo/client';

export const GetCategories = gql`
    query {
        categories {
            id
            name
        }
    }
`;