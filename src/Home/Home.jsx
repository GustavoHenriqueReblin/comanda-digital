import Loading from '../components/loading';

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Home() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !Cookies.get(process.env.REACT_APP_COOKIE_NAME_USER_TOKEN)) {
      navigate('/login'); 
    }
    setLoading(false);
  }, [loading, navigate]);

  return (
    <>
      { loading ? <Loading /> : 
        <h1>
          Home
        </h1>
      }
    </>
  );
}
  
export default Home;