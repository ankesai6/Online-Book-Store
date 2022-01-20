import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import jwt_decode from "jwt-decode";
import axios from "axios";

const LoginScreen = ({ location, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null);
  
    const dispatch = useDispatch()
  
    const userLogin = useSelector((state) => state.userLogin)
    const { loading, error, userInfo } = userLogin
  
    const redirect = location.search ? location.search.split('=')[1] : '/'
  
    useEffect(() => {
      if (userInfo) {
        history.push(redirect)
      }
    }, [history, userInfo, redirect])
  
    const submitHandler = (e) => {
      e.preventDefault()
      dispatch(login(email, password))
    }
    const refreshToken = async () => {
      try {
        const res = await axios.post("/refresh", { token: user.refreshToken });
        setUser({
          ...user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        });
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
  
    const axiosJWT = axios.create()
  
    axiosJWT.interceptors.request.use(
      async (config) => {
        let currentDate = new Date();
        const decodedToken = jwt_decode(user.accessToken);
        if (decodedToken.exp * 1000 < currentDate.getTime()) {
          const data = await refreshToken();
          config.headers["authorization"] = "Bearer " + data.accessToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  
    

    return (
        <FormContainer>
          <h1>Sign In</h1>
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter Your Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>
    
            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter Your Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
    
            <Button type='submit' variant='primary'>
              Sign In
            </Button>
          </Form>
    
          <Row className='py-3'>
            <Col>
             If r u New ?{' '}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
               Please Register
              </Link>
            </Col>
          </Row>
        </FormContainer>
      )
    }
    
    export default LoginScreen
