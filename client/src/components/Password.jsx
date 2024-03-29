import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png'
import toast, { Toaster } from 'react-hot-toast'
import { useFormik } from 'formik'
import { passwordVerification } from '../helper/validate'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import { verifyUserAccount } from '../helper/helper'

import styles from '../styles/Username.module.css'


const Password = () => {
  const navigate = useNavigate();

  const { username } = useAuthStore(state => state.auth)
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`)
  
  const formik = useFormik({
    initialValues : {
      password: 'soso.soso1993.'
    },
    validate: passwordVerification,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      // console.log(values);
      let loginPromise = verifyUserAccount({ username, password: values.password })
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Doesn't Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        navigate('/profile')
      })
    }
  })

  if(isLoading) return <h1 className='text-2xl font-bold'>Loading...</h1>
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div>
      {/* **************Header Title*************** */}
      <Helmet>
        <title>Password!</title>
        <meta name='description' content='Experience real-time interactive login UI.' />
      </Helmet>
      {/* *************Header Title**************** */}
      
      
    <div className="container mx-auto">
        <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
          {/* The "?" indicates if get slow in fetching the data then just show what is seen only, otherwise do not executes anything*/}
            <h4 className='text-3xl font-bold'>Hello {apiData?.firstName || apiData?.username}!</h4>  
            <span className='py-2 text-xxl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-4'>
                  <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password' />
                  <button className={styles.btn_blue} type='submit'>Sign In</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Forgot Password? <Link className='text-red-500 underline' to="/recovery">Recover Now</Link></span>
              </div>

            </form>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Password