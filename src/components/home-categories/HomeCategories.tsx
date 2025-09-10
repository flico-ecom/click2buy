import { $, component$, useStore, useTask$ } from '@builder.io/qwik';
import { SearchResponse } from '~/generated/graphql';
import { FacetWithValues } from '~/types';
import { searchQueryWithCollectionSlug } from '~/providers/shop/products/products';
import TopSellingProductCard from '../products/TopSellingProductCard';

interface IProps {
	slug: string;
	title: string;
}
export default component$(({ slug, title }: IProps) => {
	const state = useStore<{
		showMenu: boolean;
		search: SearchResponse | null;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		showMenu: false,
		search: null,
		facedValues: [],
		facetValueIds: [],
	});
	const collectionSignal = useStore<{ slug: string }>({ slug: slug });

	const fetchProducts = $(async (collectionSlug: string) => {
		const search = await searchQueryWithCollectionSlug(collectionSlug);
		state.search = search;
	});

	useTask$(async ({ track }) => {
		track(() => collectionSignal.slug);
		await fetchProducts(slug);
	});

	const products = state.search?.items ?? [];

	return (
		<div class="flex mt-4">
			<div class="w-full">
				<h2 class="sub-title">{title}</h2>
				{/* <div class="flex   md:gap-0 gap-4"> */}

				<div class="flex-1">
					<div class="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3 product-fade">
						{products.slice(0, 4).map((item) => (
							<TopSellingProductCard
								collection={'Recommended'}
								key={item.productId}
								productAsset={item.productAsset}
								productName={item.productName}
								slug={item.slug}
								priceWithTax={item.priceWithTax}
								currencyCode={item.currencyCode}
							></TopSellingProductCard>
						))}
					</div>
				</div>
				{/* </div> */}
			</div>
		</div>
	);
});
