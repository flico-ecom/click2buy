import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import Price from './Price';
import { getProductBySlug } from '~/providers/shop/products/products';
import { gsap } from 'gsap';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode, collection, index }: any) => {
		const productSignal = useSignal<any>();
		const cardRef = useSignal<Element>();

		useVisibleTask$(async ({ track }) => {
			track(() => cardRef.value); // Track the ref value to re-run if it changes
			productSignal.value = await getProductBySlug(slug);

			// GSAP animation for slide-in and fade-in
			if (cardRef.value) {
				gsap.from(cardRef.value, {
					x: 100, // Start 100px from the right
					opacity: 0, // Start completely faded out
					duration: 0.8, // Animation duration
					ease: 'power3.out', // Smooth easing
					delay: index * 0.1, // Staggered delay based on index
					clearProps: 'all', // Remove inline styles after animation
				});
			}
		});

		return (
			<div class=" relative flex flex-col items-center justify-between w-full max-w-xs p-1 sm:p-2  rounded-lg  border border-gray-120 hover:border-0  hover:shadow-xl transition-shadow duration-300">
				<a class="flex flex-col mx-auto" href={`/products/${slug}/`}>
					<Image
						layout="fixed"
						class=" flex-grow  object-cover aspect-[7/8]"
						width="200"
						height="200"
						src={productAsset?.preview + '?w=300&h=400&format=webp'}
						alt={`Image of: ${productName}`}
					/>
					<div class="absolute m-1 left-2  p-1 text-sm  md:font-roboto bg-blue-400 text-balck rounded  ">
						{collection}
					</div>
					<div class="flex w-full flex-col gap-1 my-2 items-center justify-between p-2">
						<h2 class="text-black text-center font-medium text-sm font-roboto">{productName}</h2>
						<Price
							priceWithTax={priceWithTax}
							currencyCode={currencyCode}
							forcedClass="text-sm text-orange-500 font-regular   text-gray-900"
						/>
						<h4 class="text-gray-800 text-sm">Rs. 215,900 7% OFF</h4>
					</div>
				</a>
			</div>
		);
	}
);
