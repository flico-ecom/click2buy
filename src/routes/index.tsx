import { component$, useContext } from '@builder.io/qwik';
import { CollectionCarousel } from '~/components/carousel/CollectionCarousel';
import Hero from '~/components/carousel/Hero';
import { APP_STATE } from '~/constants';

export default component$(() => {
	const collections = useContext(APP_STATE).collections;
	return (
		<div class="xl:max-w-7xl xl:mx-auto xl:px-8">
			<Hero />

			<section class="pt-12 xl:max-w-7xl xl:mx-auto xl:px-8">
				<div class="mt-4 flow-root">
					<div class="-my-2">
						<div class="box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible">
							<div class="sm:px-6 lg:px-8 xl:px-0 pb-4">
								<h2 class="sub-title">{$localize`Shop by Category`}</h2>
							</div>
							<CollectionCarousel collections={collections} autoplayInterval={3000} />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
});
