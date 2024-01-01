import '../global.scss';
import '../Login/login.scss';
import Loading from '../components/loading';

import { useEffect, useState } from 'react';
import { GetUser } from '../graphql/queries/userQueries';
import { useLazyQuery  } from '@apollo/client';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [getUser, { data }] = useLazyQuery(GetUser);
  const navigate = useNavigate();

  // Ao dar o refetch no usuário verifica os dados
  useEffect(() => {
    if (data && data.user != null) {
      const token = data.user.token; 
      const dateExpires = new Date(new Date().getTime() + (24 * 60 * 60) * 1000); // 1 dia a partir de agora
      Cookies.set(process.env.REACT_APP_COOKIE_NAME_USER_TOKEN, token, { secure: true, sameSite: 'strict', expires: dateExpires });
      navigate('/admin');
    }

    setLoading(false);
  }, [data, navigate]);

  // Se já tiver token vai para o admin
  useEffect(() => {
    if (!loading && !!(Cookies.get(process.env.REACT_APP_COOKIE_NAME_USER_TOKEN))) {
      navigate('/admin'); 
    }
  }, [loading, navigate]);

  // Ao clicar em entrar
  const handleSubmit = (e) => {
    e.preventDefault();
    getUser({
      variables: { input: { username: user, password: password } },
    });
  };

  return (
    <>
      { loading ? <Loading /> : 
        <div className="page">
          <div className="container">
            <form className='login' onSubmit={handleSubmit}>
              <input
                className='input'
                type="text"
                aria-label="user input"
                placeholder="seu-email@valido.com.br"
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <input
                className='input'
                type="password"
                aria-label="password input"
                placeholder="sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='button' type="submit">Entrar</button>
            </form>
          </div>
        </div>
      }
    </>
  );
}

export default Login;