import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { Carousel } from '@qwik-ui/headless';
import { Image } from 'qwik-image';

export default component$(() => {
	const isAutoplaySig = useSignal(false);

	useVisibleTask$(() => {
		isAutoplaySig.value = true;
	});

	const bannerData = [
		{
			id: 1,
			image: '/banner1.png',
			imageMobile: '/banner-mobile1.png',
			alt: 'Banner 1',
			link: '',
		},
		{
			id: 2,
			image: '/banner2.png',
			imageMobile: '/banner-mobile2.png',
			alt: 'Banner 2',
			link: '',
		},
		{
			id: 3,
			image: '/banner3.png',
			imageMobile: '/banner-mobile3.png',
			alt: 'Banner 3',
			link: '',
		},
	];
	return (
		<div class="container">
			<Carousel.Root
				class="carousel-root"
				gap={0}
				autoPlayIntervalMs={2500}
				bind:autoplay={isAutoplaySig}
				rewind={true}
			>
				<Carousel.Scroller class="carousel-scroller">
					{bannerData.map((banner) => (
						<Carousel.Slide key={banner.id} class="carousel-slide secondary">
							<div class="relative w-full  ">
								<Image src={banner.image} alt={banner.alt} class="w-full " layout="constrained" />
							</div>
						</Carousel.Slide>
					))}
				</Carousel.Scroller>
			</Carousel.Root>
		</div>
	);
});
