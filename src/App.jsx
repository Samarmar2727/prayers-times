
import MainContent from './MainContent'
import Container from '@mui/material/Container';

import './App.css'

function App() {
 

  return (
    <>
      <div className="overlay"></div>
      <div className="content" style={{ width:"100vw"}}>
      <div style={{display:"flex", justifyContent:"center", width:"100%",  height:"100%"}}>
        <Container maxWidth="xl">
        <MainContent/>
        </Container>
      </div>
      </div>
      
   
    </>
  )
}

export default App
