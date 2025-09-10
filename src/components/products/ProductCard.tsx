import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import Price from './Price';
import { getProductBySlug } from '~/providers/shop/products/products';

export default component$(
	({ productAsset, productName, slug, priceWithTax, currencyCode, collection, inStock }: any) => {
		const productSignal = useSignal<any>();
		useVisibleTask$(async () => {
			productSignal.value = await getProductBySlug(slug);
		});

		return (
			<div class=" relative flex flex-col items-center justify-between w-full max-w-xs p-1 sm:p-2 border-gray-120 rounded-lg border hover:border-0  hover:shadow-2xl transition-shadow duration-500">
				<a class="flex flex-col mx-auto" href={`/products/${slug}/`}>
					<Image
						layout="fixed"
						class=" flex-grow  object-cover aspect-[7/8]"
						width="200"
						height="200"
						src={productAsset?.preview + '?w=300&h=400&format=webp'}
						alt={`Image of: ${productName}`}
					/>
					<div class="absolute m-1 left-2  px-1 text-sm  font-roboto bg-orange-500 text-white rounded  ">
						{collection}
					</div>
					<div class="flex w-full flex-col items-start justify-between p-2">
						<h2 class="text-gray-900  font-medium text-sm font-roboto">{productName}</h2>
						<Price
							priceWithTax={priceWithTax}
							currencyCode={currencyCode}
							forcedClass="text-sm text-gray-900"
						/>

						<div class="uppercase text-xs font-medium text-orange-500 px-2 py-1 rounded bg-green-200 ">
							free shipping
						</div>

						<div class="">{inStock ? 'In Stock' : 'Out Of Stock'}</div>
					</div>
				</a>
			</div>
		);
	}
);
