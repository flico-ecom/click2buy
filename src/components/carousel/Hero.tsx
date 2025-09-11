import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { fetchContentfulEntries } from '~/utils/contentful';
import type { HeroBanner } from '~/types';

export default component$(() => {
	const contentfulData = useSignal<HeroBanner[]>([]);

	useVisibleTask$(async () => {
		const entries = await fetchContentfulEntries('heroSlider');
		contentfulData.value = entries as unknown as HeroBanner[]; // Explicitly cast to HeroBanner[]
	});

	useVisibleTask$(() => {
		Swiper.use([Autoplay]);
		new Swiper('.swiper', {
			loop: true,
			slidesPerView: 1,
			//   spaceBetween: 16,
			// breakpoints: {
			// 	768: {
			// 		slidesPerView: 2,
			// 	},
			// 	1024: {
			// 		slidesPerView: 4,
			// 	},
			// },
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
		});
	});

	return (
		<div class="swiper">
			<div class="swiper-wrapper ">
				{contentfulData.value.map((banner, index) => (
					<div key={index} class="swiper-slide">
						<div class="md:m-4">
							<picture>
								<source
									media="(max-width: 767px)"
									srcset={`https:${banner.fields.mobile.fields.file.url}`}
								/>
								<img
									src={`https:${banner.fields.desktop.fields.file.url}`}
									alt={banner.fields.alt}
									class="w-full md:rounded-2xl"
									style={{ width: '100%' }}
									width={1920}
									height={1080}
								/>
							</picture>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
