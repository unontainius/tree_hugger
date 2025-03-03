// src/routes/users/[id]/+page.js
import db from '$lib/services/treeDb';
export async function load({ params }) {
	// Access the route parameters
	// console.log(params.id.toString());
	const id: string = params.id.toString();
	return {
		data: await db.Person.single(id)
	};
}
