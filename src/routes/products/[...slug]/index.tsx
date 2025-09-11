import { component$, useComputed$, useContext, useSignal } from '@builder.io/qwik';
import { DocumentHead, routeLoader$, useNavigate } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import Alert from '~/components/alert/Alert';
import Breadcrumbs from '~/components/breadcrumbs/Breadcrumbs';
import CheckIcon from '~/components/icons/CheckIcon';
import Price from '~/components/products/Price';
import StockLevelLabel from '~/components/stock-level-label/StockLevelLabel';
import { APP_STATE } from '~/constants';
import { Order, OrderLine } from '~/generated/graphql';
import { addItemToOrderMutation } from '~/providers/shop/orders/order';
import { getProductBySlug } from '~/providers/shop/products/products';
import { Variant } from '~/types';
import { cleanUpParams, generateDocumentHead } from '~/utils';
import { splitDescriptionByHr } from '~/utils';
import Swal from 'sweetalert2';
import { useToast } from '~/components/toast/ToastContext';
import { addRecentlyViewedProduct } from '~/utils/recently-viewed';

export const useProductLoader = routeLoader$(async ({ params }) => {
	const { slug } = cleanUpParams(params);
	const product = await getProductBySlug(slug);

	if (product) {
		addRecentlyViewedProduct(product.id);
	}

	if (product.assets.length === 1) {
		product.assets.push({
			...product.assets[0],
			id: 'placeholder_2',
			name: 'placeholder',
			preview: '/asset_placeholder.webp',
		});
	}
	return product;
});

export default component$(() => {
	const appState = useContext(APP_STATE);
	const productSignal = useProductLoader();
	const toast = useToast();
	const navigate = useNavigate();
	const currentImageSig = useSignal(productSignal.value.assets[0]);
	const selectedVariantIdSignal = useSignal(productSignal.value.variants[0].id);
	const selectedVariantSignal = useComputed$(() =>
		productSignal.value.variants.find((v) => v.id === selectedVariantIdSignal.value)
	);
	const addItemToOrderErrorSignal = useSignal('');
	const activeTabSignal = useSignal<'description' | 'specifications'>('description');
	const quantitySignal = useComputed$<Record<string, number>>(() => {
		const result: Record<string, number> = {};
		(productSignal.value.variants || []).forEach((variant: Variant) => {
			const orderLine = (appState.activeOrder?.lines || []).find(
				(l: OrderLine) =>
					l.productVariant.id === variant.id &&
					l.productVariant.product.id === productSignal.value.id
			);
			result[variant.id] = orderLine?.quantity || 0;
		});
		return result;
	});

	return (
		<div>
			{selectedVariantSignal.value?.id && (
				<span class="hidden">{selectedVariantSignal.value?.id}</span>
			)}
			<div class="max-w-6xl mx-auto px-4 py-10">
				<div>
					<h2 class="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
						{productSignal.value.name}
					</h2>
					<Breadcrumbs
						items={
							productSignal.value.collections[productSignal.value.collections.length - 1]
								?.breadcrumbs ?? []
						}
					></Breadcrumbs>
					<div class="md:grid md:grid-cols-2 md:gap-x-4 justify-center md:items-start mt-4 md:mt-12">
						<div class="w-full sm:block">
							<span class="rounded-md overflow-hidden">
								<div class="w-full">
									<Image
										layout="fixed"
										class="object-center object-cover rounded-lg mx-auto"
										width="400"
										height="400"
										src={currentImageSig.value.preview + '?w=400&h=400&format=webp'}
										alt={`Image of: ${currentImageSig.value.name}`}
									/>
								</div>
								{productSignal.value.assets.length > 1 && (
									<div class="w-full md:w-[400px] my-2 flex flex-wrap gap-3 justify-center">
										{productSignal.value.assets.map((asset, key) => (
											<Image
												key={key}
												layout="fixed"
												class={{
													'object-center object-cover rounded-lg': true,
													'border-b-8 border-primary-600': currentImageSig.value.id === asset.id,
												}}
												width="80"
												height="80"
												src={asset.preview + '?w=400&h=400&format=webp'}
												alt={`Image of: ${asset.name}`}
												onClick$={() => {
													currentImageSig.value = asset;
												}}
											/>
										))}
									</div>
								)}
							</span>
						</div>
						{/* <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0"> */}

						{/* {1 < productSignal.value.variants.length && (
									<div class="mt-4">
										<label class="block text-sm font-medium text-gray-700">Select option</label>
										<select
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
											value={selectedVariantIdSignal.value}
											onChange$={(_, el) => (selectedVariantIdSignal.value = el.value)}
										>
											{productSignal.value.variants.map((variant) => (
												<option
													key={variant.id}
													value={variant.id}
													selected={selectedVariantIdSignal.value === variant.id}
												>
													{variant.name}
												</option>
											))}
										</select>
									</div>
								)} */}
						{/* <div class="mt-10 flex flex-col sm:flex-row sm:items-center">
									<Price
										priceWithTax={selectedVariantSignal.value?.priceWithTax}
										currencyCode={selectedVariantSignal.value?.currencyCode}
										variantSig={selectedVariantSignal}
										forcedClass="text-3xl text-gray-900 mr-4"
									></Price>
									<div class="flex sm:flex-col1 align-baseline">
										<button
											class={{
												'max-w-xs flex-1 transition-colors border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full':
													true,
												'bg-primary-600 hover:bg-primary-700':
													quantitySignal.value[selectedVariantIdSignal.value] === 0,
												'bg-green-600 active:bg-green-700 hover:bg-green-700':
													quantitySignal.value[selectedVariantIdSignal.value] >= 1 &&
													quantitySignal.value[selectedVariantIdSignal.value] <= 7,
												'bg-gray-600 cursor-not-allowed':
													quantitySignal.value[selectedVariantIdSignal.value] > 7,
											}}
											onClick$={async () => {
												if (quantitySignal.value[selectedVariantIdSignal.value] <= 7) {
													const addItemToOrder = await addItemToOrderMutation(
														selectedVariantIdSignal.value,
														1
													);

													if (addItemToOrder.__typename !== 'Order') {
														addItemToOrderErrorSignal.value = addItemToOrder.errorCode;
													} else {
														appState.activeOrder = addItemToOrder as Order;
													}
												}
											}}
										>
											{quantitySignal.value[selectedVariantIdSignal.value] ? (
												<span class="flex items-center">
													<CheckIcon />
													{$localize`${quantitySignal.value[selectedVariantIdSignal.value]} in cart`}
												</span>
											) : (
												$localize`Add to cart`
											)}
										</button>
										<button
											type="button"
											class="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
										>
											<HeartIcon />
											<span class="sr-only">{$localize`Add to favorites`}</span>
										</button>
									</div>
								</div> */}

						{/* </div> */}
						<div class="w-full  ">
							<div class="">
								<h2 class="sub-title mt-0 mb-2 ">{productSignal.value.name}</h2>
								<div class="my-2 flex items-center space-x-2 mb-2 ">
									<span class="text-gray-600 text-xs font-medium bg-white  inline-flex items-center px-2 py-0.5 rounded ">
										SKU : {selectedVariantSignal.value?.sku}
									</span>
									<StockLevelLabel stockLevel={selectedVariantSignal.value?.stockLevel} />
								</div>
								<Price
									priceWithTax={selectedVariantSignal.value?.priceWithTax}
									currencyCode={selectedVariantSignal.value?.currencyCode}
									variantSig={selectedVariantSignal}
									forcedClass="text-xl text-green-600 mr-4 "
								></Price>
								<h3 class="sr-only font-serif">Description</h3>
								{/* {splitDescriptionByHr(productSignal.value.description)[0] ? (
									<div
										class="text-sm text-gray-700"
										dangerouslySetInnerHTML={
											splitDescriptionByHr(productSignal.value.description)[0]
										}
									/>
								) : (
									<div
										class="text-sm text-gray-700"
										dangerouslySetInnerHTML={productSignal.value.description}
									/>
								)} */}
								{/* <div
									class="text-sm text-gray-700"
									dangerouslySetInnerHTML={splitDescriptionByHr(productSignal.value.description)[0]}
								/> */}
								{!!addItemToOrderErrorSignal.value && (
									<div class="mt-4">
										<Alert message={addItemToOrderErrorSignal.value} />
									</div>
								)}
							</div>

							<div class=" py-2 flex flex-col justify-center w-full gap-4">
								{1 < productSignal.value.variants.length && (
									<div class="mt-4">
										<label class="block text-sm font-medium text-gray-700">Select option</label>
										<select
											class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
											value={selectedVariantIdSignal.value}
											onChange$={(_, el) => (selectedVariantIdSignal.value = el.value)}
										>
											{productSignal.value.variants.map((variant) => (
												<option
													key={variant.id}
													value={variant.id}
													selected={selectedVariantIdSignal.value === variant.id}
												>
													{variant.name}
												</option>
											))}
										</select>
									</div>
									// <div class="mt-1 space-y-2">
									// 	{productSignal.value.variants.map((variant) => (
									// 		<label
									// 			key={variant.id}
									// 			class="flex items-center space-x-2 border p-2 rounded-md cursor-pointer hover:bg-gray-50"
									// 		>
									// 			<input
									// 				type="radio"
									// 				name="variant"
									// 				value={variant.id}
									// 				checked={selectedVariantIdSignal.value === variant.id}
									// 				onChange$={() => (selectedVariantIdSignal.value = variant.id)}
									// 				class="text-primary-500"
									// 			/>
									// 			<span>{variant.name}</span>
									// 		</label>
									// 	))}
									// </div>
								)}

								<div class="flex gap-1 align-baseline">
									<button
										class={{
											'card-btn group p-1 sm:p-2 flex flex-1 bg-orange-500 text-white justify-center gap-1 md:flex-1  rounded-md transition-colors text-sm':
												true,
											'bg-orange-500 hover:bg-orange-600':
												quantitySignal.value[selectedVariantIdSignal.value] === 0,
											'bg-green-600 active:bg-green-700 hover:bg-green-700':
												quantitySignal.value[selectedVariantIdSignal.value] >= 1 &&
												quantitySignal.value[selectedVariantIdSignal.value] <= 7,
											'bg-gray-600 cursor-not-allowed':
												quantitySignal.value[selectedVariantIdSignal.value] > 7,
										}}
										onClick$={async () => {
											if (quantitySignal.value[selectedVariantIdSignal.value] <= 7) {
												const addItemToOrder = await addItemToOrderMutation(
													selectedVariantIdSignal.value,
													1
												);

												if (addItemToOrder.__typename !== 'Order') {
													addItemToOrderErrorSignal.value = addItemToOrder.errorCode;
												} else {
													appState.activeOrder = addItemToOrder as Order;
												}
											}
										}}
									>
										{quantitySignal.value[selectedVariantIdSignal.value] ? (
											<span class="flex items-center">
												<CheckIcon />
												{$localize`${quantitySignal.value[selectedVariantIdSignal.value]} in cart`}
											</span>
										) : (
											<span class="flex card-btn-span">{$localize`Add to cart`}</span>
										)}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus text-white"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
											<path d="M12.5 17h-6.5v-14h-2" />
											<path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" />
											<path d="M16 19h6" />
											<path d="M19 16v6" />
										</svg>
									</button>
									<button
										onClick$={async () => {
											if (
												!productSignal.value ||
												!productSignal.value.variants ||
												productSignal.value.variants.length === 0
											) {
												Swal.fire({
													title: 'Error',
													text: 'This product is currently unavailable.',
													icon: 'error',
												});
												return;
											}
											const addItemToOrder = await addItemToOrderMutation(
												productSignal.value.variants[0].id,
												1
											);

											if (addItemToOrder.__typename !== 'Order') {
												Swal.fire({
													title: 'Error',
													text: 'Failed to add product to cart. Please try again.',
													icon: 'error',
												});
											} else {
												appState.activeOrder = addItemToOrder as Order;
											}
											toast.value = { message: 'Navigate to checkout.!', visible: true };
											navigate(`/checkout`);
										}}
										class="card-btn group p-1 sm:p-2 flex flex-1 bg-orange-500 hover:bg-green-600 text-white items-center border border-gray-100   justify-center gap-1 md:flex-1  rounded-md transition-colors text-sm"
									>
										<span class="flex card-btn-span">Buy Now</span>

										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											class="icon icon-tabler icons-tabler-outline icon-tabler-wallet"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<path d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12" />
											<path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
										</svg>
									</button>
								</div>

								<h4>Guaranteed Safe Checkout</h4>
								<div class="flex items-center">
									<div class="flex space-x-2">
										<div class="">
											<Image
												src="/assets/svg/visa.svg"
												alt="Apple Pay"
												width={30}
												height={20}
												class="h-5 w-auto"
												layout="constrained"
											/>
										</div>
										<div>
											<Image
												src="/assets/svg/mastercard.svg"
												alt="Visa"
												width={30}
												height={20}
												class="h-5 w-auto"
												layout="constrained"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Product Tabs Section */}
			<div class="max-w-6xl  mx-auto px-4 py-10">
				<div class="mt-4  pb-12 border-b ">
					{/* Tab Navigation */}
					<div class="border-b border-gray-200">
						<nav class="-mb-px flex p-1 bg-orange-50">
							<button
								class={{
									'whitespace-nowrap py-1 w-full font-medium text-sm': true,
									' bg-white  border-orange-500 border-t-2':
										activeTabSignal.value === 'description',
									' text-gray-500 hover:text-gray-700 hover:border-gray-300':
										activeTabSignal.value !== 'description',
								}}
								onClick$={() => (activeTabSignal.value = 'description')}
							>
								Description
							</button>
							<button
								class={{
									'whitespace-nowrap w-full py-1  font-medium text-sm': true,
									'bg-white border-t-2 border-orange-500':
										activeTabSignal.value === 'specifications',
									' text-gray-500 hover:text-gray-700 hover:border-gray-300':
										activeTabSignal.value !== 'specifications',
								}}
								onClick$={() => (activeTabSignal.value = 'specifications')}
							>
								Specifications
							</button>
						</nav>
					</div>

					{/* Tab Content */}
					<div class="bg-white p-4">
						{activeTabSignal.value === 'description' && (
							<div class="text-base text-gray-700">
								<div
									class="text-sm text-gray-700"
									dangerouslySetInnerHTML={
										splitDescriptionByHr(productSignal.value.description)[0] +
										splitDescriptionByHr(productSignal.value.description)[1]
									}
								/>
							</div>
						)}

						{activeTabSignal.value === 'specifications' && (
							<div class="text-base text-gray-700">
								<div
									class="text-sm text-gray-700"
									dangerouslySetInnerHTML={splitDescriptionByHr(productSignal.value.description)[2]}
								/>
							</div>
							// <div class="text-base text-gray-700">
							// 	<div class="space-y-4">
							// 		<div class="grid grid-cols-1">
							// 			<div>
							// 				<h4 class="font-medium text-gray-900 mb-2">{$localize`Product Details`}</h4>
							// 				<dl class="space-y-2">
							// 					<div class="flex justify-between">
							// 						<dt class="text-gray-500">{$localize`SKU`}:</dt>
							// 						<dd class="text-gray-900">{selectedVariantSignal.value?.sku}</dd>
							// 					</div>
							// 					<div class="flex justify-between">
							// 						<dt class="text-gray-500">{$localize`Stock Level`}:</dt>
							// 						<dd class="text-gray-900">
							// 							<StockLevelLabel stockLevel={selectedVariantSignal.value?.stockLevel} />
							// 						</dd>
							// 					</div>
							// 					{selectedVariantSignal.value?.facetValues &&
							// 						selectedVariantSignal.value.facetValues.length > 0 &&
							// 						selectedVariantSignal.value.facetValues.map((facetValue) => (
							// 							<div key={facetValue.id} class="flex justify-between">
							// 								<dt class="text-gray-500">{facetValue.facet.name}:</dt>
							// 								<dd class="text-gray-900">{facetValue.name}</dd>
							// 							</div>
							// 						))}
							// 				</dl>
							// 			</div>
							// 		</div>
							// 	</div>
							// </div>
						)}
					</div>
				</div>
			</div>

			{/* {isEnvVariableEnabled('VITE_SHOW_REVIEWS') && (
				<div class="mt-24">
					<TopReviews />
				</div>
			)} */}
		</div>
	);
});

export const head: DocumentHead = ({ resolveValue, url }) => {
	const product = resolveValue(useProductLoader);
	return generateDocumentHead(
		url.href,
		product.name,
		product.description,
		product.featuredAsset?.preview
	);
};
