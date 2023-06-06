<template>
	<div class="login-view">
		<div class="image-container">
			<img src="https://cdn.freebiesupply.com/logos/large/2x/dbs-bank-logo-png-transparent.png" alt="Login Image">
		</div>
		<div class="login-container">
			<h2>Login</h2>
			<form>
				<div class="form-group">
					<label for="username">Username</label>
					<input type="text" id="username" v-model="username">
				</div>
				<div class="form-group">
					<label for="password">Password</label>
					<input type="password" id="password" v-model="password">
				</div>
				<button type="submit" @click.prevent="login">Login</button>
			</form>
		</div>
	</div>
</template>
  
<script>
import axios from 'axios'
export default {
	data() {
		return {
			username: '',
			password: '',
		}
	},
	methods: {
		login() {
			const formData = new FormData()
			formData.append("username", this.username)
			formData.append("password", this.password)
			axios.post('http://127.0.0.1:8000/login', formData, { withCredentials: true})
				.then(response => {
					this.$router.push('/main')
				})
				.catch(error => {
					window.alert(error.response.data.detail)
				})
			// localStorage.setItem("isLoggedIn", true)
			// this.$router.push('/main')
		}
	}
}
</script>
  
<style>
.login-view {
	display: grid;
	grid-template-columns: 70vw 30vw;
	height: 100vh;
}

.image-container {
	display: flex;
	justify-content: center;
	align-items: center;
	max-height: 100vh;
	background-image: url(https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW13NLZ?ver=3bbc);
}

.image-container img {
	max-width: 100%;
	max-height: 100%;
}

.login-container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	padding: 2rem;
}

.login-container h2 {
	margin-bottom: 1rem;
}

.form-group {
	display: flex;
	flex-direction: column;
	margin-bottom: 1rem;
}

label {
	margin-bottom: 0.5rem;
}

input[type="text"],
input[type="password"] {
	padding: 0.5rem;
	border: 1px solid #ccc;
	border-radius: 0.25rem;
	font-size: 1rem;
	margin-bottom: 0.5rem;
}

button[type="submit"] {
	width: 100%;
	padding: 0.5rem 1rem;
	background-color: #073642;
	color: #fff;
	border: none;
	border-radius: 0.25rem;
	font-size: 1rem;
	cursor: pointer;
}

button[type="submit"]:hover {
	background-color: #CC0000;
}
</style>