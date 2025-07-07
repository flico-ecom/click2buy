import { $, component$, useStore, useTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { SearchResponse } from '~/generated/graphql';
import { searchAllProducts } from '~/providers/shop/products/products';
import { FacetWithValues } from '~/types';
import {
	changeUrlParamsWithoutRefresh,
	enableDisableFacetValues,
	generateDocumentHead,
	groupFacetValues,
} from '~/utils';

export const useSearchLoader = routeLoader$(async ({ url }) => {
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];
	return await searchAllProducts(activeFacetValueIds);
});

export default component$(() => {
	const { url } = useLocation();
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const searchSignal = useSearchLoader();

	const state = useStore<{
		showMenu: boolean;
		search: SearchResponse;
		facedValues: FacetWithValues[];
		facetValueIds: string[];
	}>({
		showMenu: false,
		search: searchSignal.value as SearchResponse,
		facedValues: groupFacetValues(searchSignal.value as SearchResponse, activeFacetValueIds),
		facetValueIds: activeFacetValueIds,
	});

	useTask$(async ({ track }) => {
		track(() => url.searchParams.get('f'));
		state.facetValueIds = url.searchParams.get('f')?.split('-') || [];
		state.search = await searchAllProducts(state.facetValueIds);
		state.facedValues = groupFacetValues(state.search as SearchResponse, state.facetValueIds);
	});

	const onFilterChange = $(async (id: string) => {
		const { facedValues, facetValueIds } = enableDisableFacetValues(
			state.facedValues,
			state.facetValueIds.includes(id)
				? state.facetValueIds.filter((f) => f !== id)
				: [...state.facetValueIds, id]
		);
		state.facedValues = facedValues;
		state.facetValueIds = facetValueIds;
		changeUrlParamsWithoutRefresh('', facetValueIds);

		state.search = await searchAllProducts(state.facetValueIds);
	});

	const onOpenCloseFilter = $((id: string) => {
		state.facedValues = state.facedValues.map((f) => {
			if (f.id === id) {
				f.open = !f.open;
			}
			return f;
		});
	});

	return (
		<div
			class="max-w-6xl mx-auto px-4 py-10"
			onKeyDown$={(event: KeyboardEvent) => {
				if (event.key === 'Escape') {
					state.showMenu = false;
				}
			}}
		>
			<div class="flex justify-between items-center">
				<h2 class="title">All Products</h2>
				<div>
					{!!state.facedValues.length && (
						<FiltersButton
							onToggleMenu$={async () => {
								state.showMenu = !state.showMenu;
							}}
						/>
					)}
				</div>
			</div>
			<div class="mt-6 grid sm:grid-cols-5 gap-x-4">
				{!!state.facedValues.length && (
					<Filters
						showMenu={state.showMenu}
						facetsWithValues={state.facedValues}
						onToggleMenu$={async () => {
							state.showMenu = !state.showMenu;
						}}
						onFilterChange$={onFilterChange}
						onOpenCloseFilter$={onOpenCloseFilter}
					/>
				)}
				<div class="sm:col-span-5 lg:col-span-4">
					<div class="grid grid-cols-2  gap-y-4 gap-x-2  md:grid-cols-4 xl:gap-x-4">
						{state.search.items.map((item) => (
							<ProductCard
								collection="All Products"
								key={item.productId}
								productAsset={item.productAsset}
								productName={item.productName}
								slug={item.slug}
								priceWithTax={item.priceWithTax}
								currencyCode={item.currencyCode}
							></ProductCard>
						))}
					</div>
				</div>
			</div>
		</div>
	);
});

export const head: DocumentHead = ({ resolveValue, url }) => {
	const search = resolveValue(useSearchLoader);
	const image = search.items?.[0]?.productAsset?.preview || undefined;
	return generateDocumentHead(url.href, 'All Products', undefined, image);
};
