import React, { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'

const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')

	async function populateQuote() {
		const req = await fetch('http://localhost:8800/api/auth/me', {
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
		})

		const data = await req.json()
		console.log(data)
		if (data) {
			setQuote(data.username)
		} else {
			alert(data.error)
		}
	}

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) {
			const user = jwt.decode(token)
			if (!user) {
				localStorage.removeItem('token')
				history.replace('/login')
			} else {
				populateQuote()
			}
		}
	}, [])

	async function updateQuote(event) {
		event.preventDefault()

		const req = await fetch('http://localhost:8800/api/auth/me', {
			method: 'POST',
			headers: {
				'x-access-token': localStorage.getItem('token'),
			},
			body: JSON.stringify({
				quote: tempQuote,
			}),
		})

		const data = await req.json()
		console.log(data)
		if (data.status === 'ok') {
			setQuote(tempQuote)
			setTempQuote('')
		} else {
			alert(data.error)
		}
	}

	const handleLogout = () => {
			localStorage.removeItem('token')
			history.replace('/login')
	}

	return (
		<div>
			<h1>Your quote: {quote || 'No quote found'}</h1>
			<form onSubmit={updateQuote}>
				<input
					type="text"
					placeholder="Quote"
					value={tempQuote}
					onChange={(e) => setTempQuote(e.target.value)}
				/>
				<input type="submit" value="Update quote" />
			</form>
			<button onClick={handleLogout}>Logout</button>
		</div>
	)
}

export default Dashboard
