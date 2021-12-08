import { useContext, useState } from 'react'
import { LoginContext } from '../../context/LoginProvider'

function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const {setUserData} = useContext(LoginContext)


	

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
		} else {
			alert('Please check your username and password')
		}
	}

	return (
		<div className="login">
			<h1>Login</h1>
			<form onSubmit={loginUser}>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Email"
				/>
				<br />
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Password"
				/>
				<br />
				<input type="submit" value="Login" />
			</form>
		</div>
	)
}

export default App
