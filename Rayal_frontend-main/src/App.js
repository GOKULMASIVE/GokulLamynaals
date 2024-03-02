import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./Routing/Main";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import Loader from "./UiComponents/Loader/Loader";
import { useSelector, useDispatch } from 'react-redux';


function App(props) {
 
  return (<>
    <BrowserRouter>
      <ToastContainer limit={4} />
      <Router />
    </BrowserRouter>
  </>
  );
}


export default App;
