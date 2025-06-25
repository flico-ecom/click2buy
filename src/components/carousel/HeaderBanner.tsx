import { component$, useVisibleTask$ } from '@builder.io/qwik';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default component$(() => {
	useVisibleTask$(() => {
		Swiper.use([Autoplay]);
		new Swiper('.swiper', {
			loop: true,
			slidesPerView: 1,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
		});
	});

	const promoMessages = [
		{ id: 1, message: 'Free Shipping On Orders Over 5000 LKR' },
		{ id: 2, message: 'Shop More, Save More: Free Shipping Over $100!' },
		{ id: 3, message: 'Buy One, Get One 50% Off!' },
		{ id: 4, message: 'Limited Edition Release – Shop Now!' },
		{ id: 5, message: 'Holiday Sale – Up to 60% Off!' },
	];

	return (
		<div class="swiper">
			<div class="swiper-wrapper  bg-orange-500 ">
				{promoMessages.map((promo) => (
					<div
						key={promo.id}
						class="swiper-slide  header-banner flex  items-center justify-center "
					>
						<div class="w-full flex  items-center justify-center">
							<span class="font-roboto text-gray-800">{promo.message}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
});
