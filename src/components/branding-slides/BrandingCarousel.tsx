import { $, component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

type BrandingCarouselProps = {
	images: string[];
	autoplayInterval?: number;
};

export const BrandingCarousel = component$<BrandingCarouselProps>(
	({ images, autoplayInterval = 3000 }) => {
		const slidesToShow = useSignal(2); // responsive: 2 (small), 4 (medium), 6 (large)
		const totalSlides = images.length;
		const current = useSignal(slidesToShow.value); // Start at first real slide (after clones)
		const isHovered = useSignal(false);
		const transitioning = useSignal(false);
		const dragStartX = useSignal<number | null>(null);
		const dragDelta = useSignal(0);
		const isDragging = useSignal(false);
		const windowWidth = useSignal(1024); // default fallback

		if (images.length <= slidesToShow.value) {
			// Just show all items in a row, no carousel logic
			return (
				<div class="w-full flex items-center justify-center gap-2">
					{images.map((image, index) => (
						<div class="min-w-0" key={index}>
							<img src={image} alt={`Branding Slide ${index + 1}`} class="max-w-full h-auto" />
						</div>
					))}
				</div>
			);
		}

		// Responsive slidesToShow for three window sizes
		useVisibleTask$(() => {
			const updateSlides = () => {
				const width = window.innerWidth;
				windowWidth.value = width;
				if (width < 600) {
					slidesToShow.value = 2;
				} else if (width >= 600 && width < 900) {
					slidesToShow.value = 4;
				} else {
					slidesToShow.value = 6;
				}

				current.value = slidesToShow.value;
			};
			updateSlides();
			window.addEventListener('resize', updateSlides);
			return () => window.removeEventListener('resize', updateSlides);
		});

		// Clone slides for infinite effect
		const slides = [
			...images.slice(-slidesToShow.value),
			...images,
			...images.slice(0, slidesToShow.value),
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
				<div
					class="flex select-none gap-4"
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
					{slides.map((image, idx) => (
						<div
							class="min-w-0 flex justify-center items-center"
							style={{ width: `${100 / slides.length}%` }}
							key={idx}
						>
							<img
								src={image}
								alt={`Branding Slide ${idx + 1}`}
								class="max-h-full max-w-full object-contain"
							/>
						</div>
					))}
				</div>
			</div>
		);
	}
);
