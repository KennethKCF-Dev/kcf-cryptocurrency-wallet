import logo from './logo.svg';
import './App.css';
//import dotenv from 'dotenv';
import Web3 from 'web3';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/home/Home';

// import router from './Router';

function App() {

  // const apiKey =  process.env['apiKey'];
  // const node = `https://go.getblock.io/${apiKey}`;

  // const web3 = new Web3(node);

  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path='/' exact Component={Home}/>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
