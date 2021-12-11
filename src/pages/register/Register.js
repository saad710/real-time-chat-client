import { Button, Card, Grid, TextField } from '@mui/material'
import { useState } from 'react'
import { Link, NavLink, useHistory } from 'react-router-dom'

function App() {
  const history = useHistory()

  const [username, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function registerUser(event) {
    event.preventDefault()

    const response = await fetch('http://localhost:8800/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    })

    const data = await response.json()
    console.log(data)

    if (data.auth === true) {
      history.push('/login')
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
        <h1 style={{ color: 'white' }}>Register</h1>
        <span style={{ color: 'white' }}>Already Registered ? </span>
        <NavLink to="/login" style={{ textDecoration: 'none' }}>
          <Button style={{ backgroundColor: '#f5fffa' }}>Login</Button>
        </NavLink>
        <form onSubmit={registerUser}>
          <TextField
            variant="standard"
            value={username}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            style={{ paddingTop: '1vh', width: '50vh' }}
          />
          <br />
          <TextField
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            style={{ paddingTop: '1vh', width: '50vh' }}
          />
          <br />
          <TextField
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{ paddingTop: '1vh', width: '50vh' }}
          />
          <br />
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
			  variant="contained"
              type="submit"
			  style={{marginTop:"1vh"}}
            >
              Register
            </Button>
          </Grid>
        </form>
      </Card>
    </Grid>
  )
}

export default App
