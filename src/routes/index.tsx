import { component$, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import Hero from '~/components/carousel/Hero';
import HomeCategories from '~/components/home-categories/HomeCategories';
import { MarqueeBrand } from '~/components/brand-carousel/marquee-brand';
import { APP_STATE } from '~/constants';

export default component$(() => {
	const showQR = useSignal(true);
	const collections = useContext(APP_STATE).collections.filter(
		(item) => item.parent?.name === '__root_collection__' && !!item.featuredAsset
	);

	useVisibleTask$(() => {
		const timer = setTimeout(() => {
			showQR.value = false;
		}, 10000);

		return () => clearTimeout(timer);
	});

	return (
		<div class="xl:max-w-7xl xl:mx-auto xl:px-8 relative">
			<div class="flex ">
				<Hero />
			</div>
			<section class="pt-12 xl:max-w-7xl xl:mx-auto xl:px-8">
				<div class="mt-4 flow-root">
					<div class="-my-2">
						<div class="box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible">
							{collections.map((cat) => (
								<HomeCategories key={cat.slug} slug={cat.slug} title={cat.name} />
							))}
							<MarqueeBrand
								images={[
									'/assets/brands/flico.png',
									'/assets/brands/konka.jpg',
									'/assets/brands/panasonic.png',
									'/assets/brands/rico.png',
									'/assets/brands/samsung.png',
									'/assets/brands/whirlpool.png',
									'/assets/brands/flico.png',
									'/assets/brands/konka.jpg',
									'/assets/brands/panasonic.png',
									'/assets/brands/rico.png',
									'/assets/brands/samsung.png',
									'/assets/brands/whirlpool.png',
								]}
							/>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
});
