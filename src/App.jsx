import { useState,useMemo } from 'react'

import Form from './module/Form/Index';
import Dashboard from './module/Dashboard/Index';
import { Router,Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Allusers from './module/Dashboard/Allusers';




function App() {
  const location = useLocation();
  // console.log(location.pathname);

  // socket connection with namesapce is here 
  
  // private route created here 
  const ProtectedRoute = ({children,auth=false})=>{
    const isloggedin = localStorage.getItem('user:token')!=null;
    console.log(isloggedin);
    if(!isloggedin &&auth){
      return <Navigate to={'/sign-in'}></Navigate>
    }
    else if(isloggedin && (location.pathname==='/signup' || location.pathname=='/sign-in')){
      return <Navigate to={'/'} />
    }
    return children
  }

  
  return(
    <>
    <Routes>
      <Route path='/' element={<ProtectedRoute auth={true}><Dashboard/></ProtectedRoute>}>
      </Route>
      <Route path='/sign-in' element={<ProtectedRoute><Form isloggedin={true}/></ProtectedRoute>}></Route>
      <Route path='/signup' element={<ProtectedRoute><Form isloggedin={false}/></ProtectedRoute>}></Route>
      <Route path='/users' element={<ProtectedRoute><Allusers isloggedin={true}s/></ProtectedRoute>}></Route>
      
    </Routes>





    

    
    </>
  );
}

export default App
