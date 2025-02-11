import { handler } from '../build/handler.js';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

// Let SvelteKit handle everything else
app.use(handler);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
