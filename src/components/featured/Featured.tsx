import { $, component$, useVisibleTask$, useStore, useTask$, useSignal } from '@builder.io/qwik';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SearchResponse } from '~/generated/graphql';
import { FacetWithValues } from '~/types';
import { searchAllProducts } from '~/providers/shop/products/products';
import { Image } from 'qwik-image';
import TopSellingProductCard from '../products/TopSellingProductCard';

export default component$(() => {
	const tSProductLRef = useSignal<HTMLElement>();
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
	useVisibleTask$(() => {
		gsap.registerPlugin(ScrollTrigger);

		const animations: gsap.core.Tween[] = [];

		if (tSProductLRef.value) {
			const anim = gsap.fromTo(
				tSProductLRef.value,
				{ scale: 0 },
				{
					scale: 1,
					duration: 1,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: tSProductLRef.value,
						start: 'top 80%',
						toggleActions: 'play none none reverse',
						markers: false,
					},
				}
			);
			animations.push(anim);
		}

		let fadeInAnimated = false;
		const scrollTrigger = ScrollTrigger.create({
			trigger: '.product-fade',
			start: 'top 80%',
			toggleActions: 'play none none reverse',
			onEnter: () => {
				if (!fadeInAnimated) {
					const fadeAnim = gsap.from('.product-fade > div', {
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

		return () => {
			animations.forEach((anim) => anim.kill());
			scrollTrigger.kill();
		};
	});

	const fetchProducts = $(async () => {
		const search = await searchAllProducts();
		state.search = search;
	});

	useTask$(async () => {
		await fetchProducts();
	});

	const products = state.search?.items ?? [];

	return (
		<div class="flex mt-4">
			<div class="w-full">
				<h2 class="sub-title">Top Selling Products</h2>
				<div class="flex flex-col md:flex-row md:gap-0 gap-4">
					<div class="md:w-80 bg-gray-100 shadow-sm lg:mr-6 h-auto">
						<div
							class="bg-blue-100 rounded-lg p-2 md:p-6 flex flex-col items-center justify-between h-full min-h-[400px]"
							ref={tSProductLRef}
						>
							<div class="text-center">
								<h3 class="text-xl">57 Odyssey Neo G9 Dual 4K UHD Quantum Mini-LED</h3>
								<p class="text-base text-gray-500 font-normal md:mb-4 mb-1">
									Polaroid Now+ Gen 2 - White
								</p>
							</div>

							<button class="flex items-center  gap-2 cursor-pointer bg-white/80 hover:bg-white text-gray-800 py-2 px-4 rounded-md transition-colors">
								Shop Now
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
									class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus text-orange-500 group-hover:text-white"
								>
									<path stroke="none" d="M0 0h24v24H0z" fill="none" />
									<path d="M4 19a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
									<path d="M12.5 17h-6.5v-14h-2" />
									<path d="M6 5l14 1l-.86 6.017m-2.64 .983h-10.5" />
									<path d="M16 19h6" />
									<path d="M19 16v6" />
								</svg>
							</button>

							<div class="mt-1 relative flex items-center justify-center w-full h-48">
								<Image
									src="/assets/images/stv.png"
									alt="TV Product"
									width={200}
									height={200}
									class="object-contain w-full h-full"
									layout="constrained"
									style={{ aspectRatio: '1/1' }}
								/>
							</div>
						</div>
					</div>
					<div class="flex-1 flex ">
						<div class="grid grid-cols-2  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 sm:gap-3 product-fade">
							{products.slice(0, 4).map((item) => (
								<div key={item.productId}>
									<TopSellingProductCard
										collection={'Recommended'}
										productAsset={item.productAsset}
										productName={item.productName}
										slug={item.slug}
										priceWithTax={item.priceWithTax}
										currencyCode={item.currencyCode}
									></TopSellingProductCard>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
