// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManageBoxes from './pages/ManageBoxes';
import ViewOrders from './pages/ViewOrders';
import Profile from './pages/Profile';
import PaymentMethod from './pages/PaymentMethod';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Switch>
          <Route path="/" exact component={Dashboard} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/manage-boxes" component={ManageBoxes} />
          <Route path="/view-orders" component={ViewOrders} />
          <Route path="/profile" component={Profile} />
          <Route path="/payment-method" component={PaymentMethod} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;