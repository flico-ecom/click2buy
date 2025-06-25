import { $, component$, useVisibleTask$, useStore, useTask$ } from '@builder.io/qwik';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SearchResponse } from '~/generated/graphql';
import { FacetWithValues } from '~/types';
import { searchQueryWithCollectionSlug } from '~/providers/shop/products/products';
import ProductCard from '../products/ProductCard';

export default component$(() => {
	useVisibleTask$(() => {
		gsap.registerPlugin(ScrollTrigger);

		const animations: gsap.core.Tween[] = [];
		const scrollTriggers: ScrollTrigger[] = [];

		let fadeInAnimated = false;
		let zoomInAnimated = false;

		const fadeTrigger = ScrollTrigger.create({
			trigger: '.fade-in',
			start: 'top 80%',
			toggleActions: 'play none none reverse',
			onEnter: () => {
				if (!fadeInAnimated) {
					const fadeAnim = gsap.from('.fade-in > div', {
						opacity: 0,
						y: 30,
						duration: 0.4,
						stagger: 0.1,
						ease: 'power2.out',
					});
					animations.push(fadeAnim);
					fadeInAnimated = true;
				}
			},
		});
		scrollTriggers.push(fadeTrigger);

		const zoomTrigger = ScrollTrigger.create({
			trigger: '.zoom-in',
			start: 'top 80%',
			toggleActions: 'play none none reverse',
			onEnter: () => {
				if (!zoomInAnimated) {
					const zoomAnim = gsap.from('.zoom-in', {
						scale: 0.8,
						opacity: 0,
						duration: 0.5,
						ease: 'power2.out',
					});
					animations.push(zoomAnim);
					zoomInAnimated = true;
				}
			},
		});
		scrollTriggers.push(zoomTrigger);

		return () => {
			animations.forEach((anim) => anim.kill());
			scrollTriggers.forEach((trigger) => trigger.kill());
		};
	});

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
	const collectionSignal = useStore<{ slug: string }>({ slug: 'electronics' });

	const fetchProducts = $(async (collectionSlug: string) => {
		const search = await searchQueryWithCollectionSlug(collectionSlug);
		state.search = search;
	});

	useTask$(async ({ track }) => {
		track(() => collectionSignal.slug);
		await fetchProducts('electronics');
	});

	const products = state.search?.items ?? [];

	return (
		<div class="flex mt-4">
			<div class="w-full">
				<h2 class="sub-title">Recommended Products</h2>
				<div class="flex flex-col pt-4 lg:flex-row gap-0 lg:gap-4">
					<div class="flex-none bg-gray-100 shadow-sm lg:mr-6 w-full lg:w-80 h-64 lg:h-auto">
						<div class="w-full h-full rounded-lg overflow-hidden">
							<img
								src={`./assets/images/advertiesment/flashsale-min.png`}
								alt={`Flash Sale`}
								class="w-full h-full rounded-lg zoom-in object-cover"
								width={320}
								height={256}
								style="aspect-ratio: 5/4;"
							/>
						</div>
					</div>
					<div class="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3 fade-in min-h-[400px]">
						{products.slice(0, 8).map((item) => (
							<ProductCard
								collection={'Recommended'}
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
