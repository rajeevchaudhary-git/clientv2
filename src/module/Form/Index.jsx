import { useState,useEffect } from 'react'
import Input from '../../components/Inputcom/Input'
import Button from '../../components/buttons/Button'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate,useLocation } from 'react-router-dom';



function Form({isloggedin = false,})
 {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isRegistred = localStorage.getItem('firstlogin');
    if (isRegistred) {
      toast.success("Registred  successfully!");
      localStorage.removeItem('firstlogin'); 
    }
  }, []);

  useEffect(() => {
    const islogout = localStorage.getItem('logout');
    if (islogout) {
      toast.success("Logout  successfully!");
      localStorage.removeItem('logout'); 
    }
  }, []);

    const[data,setdata]=useState({
        ...(!isloggedin && {
            fullname:''
        }),
        email:'',
        password:'',

    });
    // console.log(data);

    const handleSubmit= async (e)=>{
      e.preventDefault();
    
       const url = `https://chatserver-pi7e.onrender.com/api/${isloggedin ? 'login':'register'}`;
       const payload ={
        email:data.email,
        password:data.password,
        ...(isloggedin ?{}:{name:data.fullname})

       }
       try{
      const response = await axios.post(url,payload); // multiple id can be genrated with single mail;
      console.log(response); 
       if(location.pathname=='/sign-in'){
        if(response.data.token.token){
          localStorage.setItem('user:token',response.data.token.token)
          localStorage.setItem('user:detail',JSON.stringify(response.data.user));
          localStorage.setItem('firstLogin', 'logged in');
          navigate("/"); 
          }
       }


       if(location.pathname=='/signup'){
        // console.log('singup ');
        if(response.data.message=="Registered successfully"){
          localStorage.setItem("firstlogin","qwqqw");
          navigate('/sign-in');
        }
       }

      } catch(error){
        if(error.response.data.error){
        toast.error(error.response.data.error);
        }
        else if(error.response.data.message){
          toast.error(error.response.data.message);
        }
        else{
          toast.error("error.response.data.message");

        }
      }
          
      
      
    }
    
 return (
    <div className=' h-screen flex justify-center items-center'>

    <div className='bg-[#2a1953] shadow-[0_35px_60px_-15px_rgba(0.9,0.9,0.9,0.9)] border-x-4  w-[550px] h-[600px] rounded-3xl flex justify-center items-center flex-col '>
      <div className='text-3xl font-extrabold text-slate-300'>Welcome {isloggedin && 'back'}</div>
      <div className='text-xl font-light mb-14 text-slate-300'>{isloggedin?"Sign in to get explore" : "Sign up to get started"}</div>
      <form className='flex justify-center items-center flex-col w-full' onSubmit={handleSubmit}>
     {!isloggedin &&  <Input name='fullname' value={data.fullname} onchange={(e)=>{setdata({...data,fullname:e.target.value})}} type='text' placeholder='Enter the full name' label='Enter the full name' className='mb-3' />}
      <Input name='email' value={data.email} onchange={(e)=>{setdata({...data,email:e.target.value})}} type='text' placeholder='Enter the email' label='Enter the email' className='mb-3 ' />
      <Input name='password' value={data.password} onchange={(e)=>{setdata({...data,password:e.target.value})}} type='password' placeholder='Enter the password' label='Enter the password' className='mb-3 '/>
      <Button type='submit' label={isloggedin ? "sign in" : "sign up"} className='w-full'/>
      <ToastContainer
        className="toast-container-center"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {!isloggedin ? <div className='mt-3 text-slate-300'>Already have an account   <span className='underline cursor-pointer '><Link to={'/sign-in'}>Sign in</Link></span></div> : (<div className='mt-3 text-slate-300'>Register To start Chatting  <span className='underline cursor-pointer '><Link to={'/signup'}>Sign up</Link></span></div>)}
      </form>
    </div>
    </div>
  )
}

export default Form
