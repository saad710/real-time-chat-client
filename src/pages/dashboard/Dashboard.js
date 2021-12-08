import React, { useContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import { useHistory } from 'react-router-dom'
import { LoginContext } from '../../context/LoginProvider'

const Dashboard = () => {
	const history = useHistory()
	const [quote, setQuote] = useState('')
	const [tempQuote, setTempQuote] = useState('')
	const {userData,setUserData} = useContext(LoginContext)


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
			setUserData(data)
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

	console.log(userData._id)

	// async function updateQuote(event) {
	// 	event.preventDefault()

	// 	const req = await fetch('http://localhost:8800/api/auth/me', {
	// 		method: 'POST',
	// 		headers: {
	// 			'x-access-token': localStorage.getItem('token'),
	// 		},
	// 		body: JSON.stringify({
	// 			quote: tempQuote,
	// 		}),
	// 	})

	// 	const data = await req.json()
	// 	console.log(data)
	// 	if (data.status === 'ok') {
	// 		setQuote(tempQuote)
	// 		setTempQuote('')
	// 	} else {
	// 		alert(data.error)
	// 	}
	// }

	const handleLogout = () => {
			localStorage.removeItem('token')
			history.replace('/login')
	}

	return (
		<div>
			<h1>This is Dashboard page</h1>
			<button onClick={handleLogout}>Logout</button>
		</div>
	)
}

export default Dashboard
