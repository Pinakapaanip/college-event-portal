const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Backend is running 🚀");
});

app.post('/login', (req, res) => {
	const { email, password } = req.body || {};
	if (email === 'admin@college.edu' && password === 'admin123') {
		return res.json({
			success: true,
			token: 'dummy-token',
			user: { name: 'Admin', role: 'admin' },
		});
	}

	return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});