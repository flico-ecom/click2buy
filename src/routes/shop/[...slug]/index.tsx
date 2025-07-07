import { $, component$, useStore, useTask$ } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useLocation } from '@builder.io/qwik-city';
import Filters from '~/components/facet-filter-controls/Filters';
import FiltersButton from '~/components/filters-button/FiltersButton';
import ProductCard from '~/components/products/ProductCard';
import { SearchResponse } from '~/generated/graphql';
import { getCollectionBySlug } from '~/providers/shop/collections/collections';
import {
	searchQueryWithCollectionSlug,
	searchQueryWithTerm,
} from '~/providers/shop/products/products';
import { FacetWithValues } from '~/types';
import {
	changeUrlParamsWithoutRefresh,
	cleanUpParams,
	enableDisableFacetValues,
	generateDocumentHead,
	groupFacetValues,
} from '~/utils';

export const useCollectionLoader = routeLoader$(async ({ params }) => {
	return await getCollectionBySlug(params.slug);
});

export const useSearchLoader = routeLoader$(async ({ params: p, url }) => {
	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];
	return activeFacetValueIds.length
		? await searchQueryWithTerm(params.slug, '', activeFacetValueIds)
		: await searchQueryWithCollectionSlug(params.slug);
});

export default component$(() => {
	const { params: p, url } = useLocation();
	const params = cleanUpParams(p);
	const activeFacetValueIds: string[] = url.searchParams.get('f')?.split('-') || [];

	const collectionSignal = useCollectionLoader();
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
		track(() => collectionSignal.value.slug);
		params.slug = cleanUpParams(p).slug;
		state.facetValueIds = url.searchParams.get('f')?.split('-') || [];
		state.search = state.facetValueIds.length
			? await searchQueryWithTerm(params.slug, '', state.facetValueIds)
			: await searchQueryWithCollectionSlug(params.slug);
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

		state.search = facetValueIds.length
			? await searchQueryWithTerm(params.slug, '', state.facetValueIds)
			: await searchQueryWithCollectionSlug(params.slug);
	});

	let subcollectioncount = 1;
	if (collectionSignal.value.children?.length) {
		subcollectioncount = collectionSignal.value.children.length - 1;
	}
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
				{/* <h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">Shop Now</h2> */}
				<h2 class="title">Seasonal Offers</h2>
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
								collection={
									collectionSignal.value.children?.length === 0
										? collectionSignal.value.name
										: collectionSignal.value.children?.[subcollectioncount]?.name
								}
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
	const collection = resolveValue(useCollectionLoader);
	let image = collection.children?.[0]?.featuredAsset?.preview || undefined;
	if (!image) {
		const search = resolveValue(useSearchLoader);
		image = search.items?.[0]?.productAsset?.preview || undefined;
	}
	return generateDocumentHead(url.href, collection.name, undefined, image);
};
