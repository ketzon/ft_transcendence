import User from "../User.js"

fastify.get('/', (req, res) => res.send("Display main page")) //GET

fastify.post('/signup', async (req, reply) => {
	console.log("entré")
	const { name, password, avatar} = req.body;

	if (!name || !password) {
		return reply.status(400).send({error: "Name and password required"});
	}

	try {
		const newUser = await User.createUser(name, password)
		if (!avatar)
			return reply.status(201).send({message: "User created successfully", user: newUser});
		try {
			await newUser.modifyAvatar(avatar);
			return reply.status(201).send({message: "Avatar updated", details: avatar});
		}
		catch (error) {
			return reply.status(500).send({error: "Avatar cannot be uploaded. Please contact support", details: error.message});
		}
	}
	catch (error) {
		if (error.code === "P2002") {
			return reply.status(409).send({ error: "User already exist. Change username", detail: error.message});
		}
		else 
			return reply.status(500).send({ error: "Unknow internal error. Please contact support ", details: error.message });
	}
})


fastify.post('/signin', (req, res) => res.send("Verify if log exist, verify if pasword is correct for this account. If yes, refresh page with user data, if not send message."))

fastify.get('/user', (req, res) => res.send("Display user data"))

