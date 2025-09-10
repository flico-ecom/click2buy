import { component$, useStore, useTask$ } from '@builder.io/qwik';
import { getRecentlyViewedProducts } from '~/utils/recently-viewed';
import { getProductById } from '~/providers/shop/products/products';
import ProductCard from './ProductCard';
import { Product } from '~/generated/graphql';

export default component$(() => {
	const state = useStore<{ products: Product[] }>({
		products: [],
	});

	useTask$(async () => {
		const productIds = getRecentlyViewedProducts();
		const fetchedProducts: Product[] = [];
		for (const id of productIds) {
			const product = await getProductById(id);
			if (product) {
				fetchedProducts.push(product);
			}
		}
		state.products = fetchedProducts;
	});

	if (state.products.length === 0) {
		return null;
	}

	return (
		<div class="max-w-6xl mx-auto px-4 py-10">
			<h2 class="title">Recently Viewed Products</h2>
			<div class="mt-6 grid grid-cols-2 gap-y-4 gap-x-2 md:grid-cols-4 xl:gap-x-4">
				{state.products.map((item) => (
					<ProductCard
						key={item.id}
						productAsset={item.featuredAsset}
						productName={item.name}
						slug={item.slug}
						priceWithTax={item.variants?.[0]?.priceWithTax}
						currencyCode={item.variants?.[0]?.currencyCode}
						inStock={item.variants?.[0]?.stockLevel === 'IN_STOCK'}
					/>
				))}
			</div>
		</div>
	);
});
