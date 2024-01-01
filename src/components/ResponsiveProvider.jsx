import '../global.scss';

function ResponsiveProvider({ children }) {
    return (
      <>
        <div className="page">
          <div className="container">
            { children }
          </div>
        </div>
      </>
    );
  }
    
  export default ResponsiveProvider;