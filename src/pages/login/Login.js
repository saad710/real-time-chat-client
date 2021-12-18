import { Button, Card, Grid, TextField } from '@mui/material'
import { useContext, useState } from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { LoginContext } from '../../context/LoginProvider'
import { AuthContext } from '../../context/AuthProvider'

function App() {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUserData } = useContext(LoginContext)
  const { auth, setAuth } = useContext(AuthContext)

  async function loginUser(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:8800/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await response.json()
    console.log(data)

    if (data.auth === true) {
      localStorage.setItem('token', data.token)
      alert('Login successful')
      window.location.href = '/messenger'
      // history.push("/messenger")
    } else {
      alert('Please check your username and password')
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ marginTop: '20vh' }}
    >
      <Card
        sx={{ maxWidth: 445 }}
        style={{ padding: '5vh', backgroundColor: '#003366' }}
      >
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <h1 style={{ color: 'white' }}>Login</h1>
          <NavLink to="/register" style={{ textDecoration: 'none' }}>
            <Button style={{ backgroundColor: '#f5fffa' }}>Register</Button>
          </NavLink>
        </Grid>
        <form onSubmit={loginUser}>
          <TextField
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            style={{ width: '30vh' }}
          />
          <br />
          <TextField
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{ paddingTop: '1vh', width: '30vh' }}
          />
          <br />
          <Button
            variant="contained"
            type="submit"
            style={{ marginTop: '1vh' }}
            value="Login"
          >
            Login
          </Button>
        </form>
      </Card>
    </Grid>
  )
}

export default App
