import { isServer } from '@builder.io/qwik';

const RECENTLY_VIEWED_COOKIE_NAME = 'recently_viewed_products';
const MAX_RECENTLY_VIEWED_PRODUCTS = 5;

/**
 * Gets the recently viewed product IDs from the cookie.
 * @returns An array of product IDs.
 */
export function getRecentlyViewedProducts(): string[] {
	if (isServer) {
		return [];
	}
	const cookieValue = document.cookie
		.split('; ')
		.find((row) => row.startsWith(`${RECENTLY_VIEWED_COOKIE_NAME}=`))
		?.split('=')[1];

	if (cookieValue) {
		try {
			return JSON.parse(decodeURIComponent(cookieValue));
		} catch (e) {
			console.error('Error parsing recently viewed products cookie:', e);
			return [];
		}
	}
	return [];
}

/**
 * Adds a product ID to the recently viewed products cookie.
 * Ensures no duplicates and limits the number of stored products.
 * @param productId The ID of the product to add.
 */
export function addRecentlyViewedProduct(productId: string) {
	if (isServer) {
		return;
	}
	let products = getRecentlyViewedProducts();

	// Remove existing product to move it to the front
	products = products.filter((id) => id !== productId);

	// Add new product to the front
	products.unshift(productId);

	// Limit the number of products
	if (products.length > MAX_RECENTLY_VIEWED_PRODUCTS) {
		products = products.slice(0, MAX_RECENTLY_VIEWED_PRODUCTS);
	}

	const cookieValue = encodeURIComponent(JSON.stringify(products));
	document.cookie = `${RECENTLY_VIEWED_COOKIE_NAME}=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
}
