import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

import { AdBanner } from './AdBanner';
import { AdBannerSimple } from './AdBannerSimple';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default component$(() => {
	const bannerLRef = useSignal<HTMLElement>();
	const bannerRRef = useSignal<HTMLElement>();

	useVisibleTask$(() => {
		gsap.registerPlugin(ScrollTrigger);

		const animations: gsap.core.Tween[] = [];

		if (bannerLRef.value) {
			const anim = gsap.fromTo(
				bannerLRef.value,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: bannerLRef.value,
						start: 'top 80%',
						toggleActions: 'play none none reverse',
						markers: false,
					},
				}
			);
			animations.push(anim);
		}

		if (bannerRRef.value) {
			const anim = gsap.fromTo(
				bannerRRef.value,
				{ scale: 0 },
				{
					scale: 1,
					duration: 0.8,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: bannerRRef.value,
						start: 'top 80%',
						toggleActions: 'play none none reverse',
						markers: false,
					},
				}
			);
			animations.push(anim);
		}

		return () => {
			animations.forEach((anim) => anim.kill());
		};
	});

	return (
		<div class="w-full max-w-7xl mx-auto  mt-7">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
				<div class="w-full h-full" ref={bannerLRef}>
					<AdBanner
						title="Special Summer Sale!"
						description="Get up to 50% off on all premium products. Limited time offer."
						ctaText="Shop Now"
						targetUrl="/summer-sale"
						imageSrc="/assets/images/advertiesment/adimage-min.png"
						backgroundColor="bg-gradient-to-r from-orange-500 to-pink-500"
					/>
				</div>
				<div class="w-full h-full " ref={bannerRRef}>
					<AdBannerSimple
						alt="Special Summer Sale!"
						targetUrl="/summer-sale"
						imageSrc="/assets/images/advertiesment/adimage3-min.png"
					/>
				</div>
			</div>
		</div>
	);
});
