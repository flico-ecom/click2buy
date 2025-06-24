import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import CollectionCardRound from '../collection-card/CollectionCardRound';

type InfiniteCarouselProps = {
	collections: any[];
	autoplayInterval?: number;
};

export const CollectionCarousel = component$<InfiniteCarouselProps>(
	({ collections, autoplayInterval = 3000 }) => {
		const slidesToShow = useSignal(3); // responsive: 3 (sm), 6 (md+)
		const totalSlides = collections.length;
		const current = useSignal(slidesToShow.value); // Start at first real slide (after clones)
		const isHovered = useSignal(false);
		const transitioning = useSignal(false);
		const dragStartX = useSignal<number | null>(null);
		const dragDelta = useSignal(0);
		const isDragging = useSignal(false);
		const windowWidth = useSignal(1024); // default fallback

		// Responsive slidesToShow
		useVisibleTask$(() => {
			const updateSlides = () => {
				slidesToShow.value = window.innerWidth >= 768 ? 6 : 3;
				windowWidth.value = window.innerWidth;
				current.value = slidesToShow.value;
			};
			updateSlides();
			window.addEventListener('resize', updateSlides);
			return () => window.removeEventListener('resize', updateSlides);
		});

		// Clone slides for infinite effect
		const slides = [
			...collections.slice(-slidesToShow.value),
			...collections,
			...collections.slice(0, slidesToShow.value),
		];

		const goTo = $((idx: number) => {
			current.value = idx;
			transitioning.value = true;
		});

		const next = $(() => {
			if (!transitioning.value) {
				goTo(current.value + 1);
			}
		});
		const prev = $(() => {
			if (!transitioning.value) {
				goTo(current.value - 1);
			}
		});

		// Autoplay
		useVisibleTask$(({ cleanup }) => {
			if (!autoplayInterval) return;
			const interval = setInterval(() => {
				if (!isHovered.value && !transitioning.value && !isDragging.value) {
					next();
				}
			}, autoplayInterval);
			cleanup(() => clearInterval(interval));
		});

		// Handle infinite loop effect after transition
		const handleTransitionEnd = $(() => {
			transitioning.value = false;
			if (current.value >= totalSlides + slidesToShow.value) {
				current.value = slidesToShow.value;
			} else if (current.value < slidesToShow.value) {
				current.value = totalSlides + slidesToShow.value - 1;
			}
		});

		// Drag/Swipe handlers
		const onDragStart = $((e: MouseEvent | TouchEvent) => {
			isDragging.value = true;
			dragDelta.value = 0;
			if ('touches' in e) {
				dragStartX.value = e.touches[0].clientX;
			} else {
				dragStartX.value = e.clientX;
			}
		});

		const onDragMove = $((e: MouseEvent | TouchEvent) => {
			if (!isDragging.value || dragStartX.value === null) return;
			let clientX = 0;
			if ('touches' in e) {
				if (e.touches.length > 0) clientX = e.touches[0].clientX;
			} else {
				clientX = e.clientX;
			}
			dragDelta.value = clientX - dragStartX.value;
		});

		const onDragEnd = $(() => {
			if (!isDragging.value) return;
			isDragging.value = false;
			if (Math.abs(dragDelta.value) > 50) {
				if (dragDelta.value < 0) {
					next();
				} else {
					prev();
				}
			}
			dragDelta.value = 0;
			dragStartX.value = null;
		});

		// Calculate transform with drag offset
		const getTransform = () => {
			const base = -(current.value * 100) / slides.length;
			const dragPercent = (dragDelta.value / windowWidth.value) * 100 * (1 / slidesToShow.value);
			return `translateX(calc(${base}% + ${dragPercent}%))`;
		};

		return (
			<div
				class="relative w-full overflow-hidden"
				onMouseEnter$={() => (isHovered.value = true)}
				onMouseLeave$={() => (isHovered.value = false)}
			>
				<button onClick$={prev} class="absolute left-0 z-10">
					‹
				</button>
				<div
					class="flex select-none"
					style={{
						width: `${(slides.length * 100) / slidesToShow.value}%`,
						transform: getTransform(),
						transition:
							transitioning.value || !isDragging.value
								? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)'
								: 'none',
						touchAction: 'pan-y',
					}}
					onTransitionEnd$={handleTransitionEnd}
					onMouseDown$={onDragStart}
					onMouseMove$={onDragMove}
					onMouseUp$={onDragEnd}
					onMouseLeave$={onDragEnd}
					onTouchStart$={onDragStart}
					onTouchMove$={onDragMove}
					onTouchEnd$={onDragEnd}
				>
					{slides.map((collection, idx) => (
						<div class="min-w-0" style={{ width: `${100 / slides.length}%` }} key={idx}>
							<CollectionCardRound collection={collection} />
						</div>
					))}
				</div>
				<button onClick$={next} class="absolute right-0 z-10">
					›
				</button>
			</div>
		);
	}
);
