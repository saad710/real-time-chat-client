import React, { useContext } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import Dashboard from './pages/dashboard/Dashboard'
import Messenger from './pages/messenger/Messenger'



const App = () => {
  // const {userData} = useContext(LoginContext)
	return (
		<div>
			<BrowserRouter>
				<Route path="/" exact component={Register} />
				<Route path="/login" exact component={Login} />
				<Route path="/register" exact component={Register} />
				<Route path="/dashboard" exact component={Dashboard} />
				<Route path="/messenger" exact component={Messenger} />
			</BrowserRouter>
		</div>
	)
}

export default App
