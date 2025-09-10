import { createClient } from 'contentful';
import { ENV_VARIABLES } from '~/env';

const space = ENV_VARIABLES.VITE_CONTENTFUL_SPACE_ID;
const accessToken = ENV_VARIABLES.VITE_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
	throw new Error(
		'Contentful Space ID and Access Token are required. Please check your .env file.'
	);
}

export const contentfulClient = createClient({
	space: space as string,
	accessToken: accessToken as string,
});

export async function fetchContentfulEntries(contentType: string, query?: any) {
	try {
		const entries = await contentfulClient.getEntries({
			content_type: contentType,
			...query,
		});

		return entries.items;
	} catch (error) {
		console.error('Error fetching Contentful entries:', error);
		return [];
	}
}

export async function listContentTypes() {
	const types = await contentfulClient.getContentTypes();
	console.log(
		'Available content types:',
		types.items.map((t) => t.sys.id)
	);
}
