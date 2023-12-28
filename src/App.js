import { useQuery, gql } from '@apollo/client';

const GetUsers = gql`
  query {
    users {
      id
      username
      password
      token
    }
  }
`;

function App() {
  function DisplayUsers() {
    const { loading, error, data } = useQuery(GetUsers);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
  
    return data.users.map(({ id, username, password, token }) => (
      <div key={id}>
        <h3>{username}</h3>
        <br />
        <p>{password}</p>
        <br />
      </div>
    ));
  }

  return (
    <div>
      <DisplayUsers />
    </div>
  );
}

export default App;
