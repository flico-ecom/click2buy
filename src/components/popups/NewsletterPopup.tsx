import { component$, useVisibleTask$, useSignal, $ } from '@builder.io/qwik';

export const NewsletterPopup = component$(() => {
	const showPopup = useSignal(false);
	const dontShowAgain = useSignal(false);
	const animateIn = useSignal(false); // controls animation

	const handleClose = $(() => {
		animateIn.value = false; // trigger slide-out
		setTimeout(() => {
			showPopup.value = false; // unmount after animation
		}, 300); // match transition duration

		if (dontShowAgain.value) {
			document.cookie = `newsletter_dont_show=1;path=/;max-age=${60 * 60 * 24 * 365 * 10}`;
		} else {
			const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
			document.cookie = `newsletter_closed_until=${expiry};path=/`;
		}
	});

	useVisibleTask$(() => {
		const cookies = document.cookie.split(';').map((c) => c.trim());
		const dontShow = cookies.find((c) => c.startsWith('newsletter_dont_show='));
		const closedUntil = cookies.find((c) => c.startsWith('newsletter_closed_until='));

		if (dontShow) return;

		if (closedUntil) {
			const expiry = parseInt(closedUntil.split('=')[1], 10);
			if (Date.now() < expiry) return;
		}

		const timer = setTimeout(() => {
			showPopup.value = true;
			// Delay slightly to trigger animation
			setTimeout(() => (animateIn.value = true), 20);
		}, 10000);

		return () => clearTimeout(timer);
	});

	return (
		<>
			{showPopup.value && (
				<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div
						class={`
              bg-white p-4 rounded shadow w-96 transform transition-transform duration-300
              ${animateIn.value ? 'translate-x-0' : 'translate-x-full'}
            `}
					>
						<h2 class="text-lg font-bold mb-2">Subscribe to our Newsletter</h2>
						<p class="mb-4">Stay updated with our latest news.</p>

						<div class="flex items-center mb-4">
							<input
								type="checkbox"
								id="dont-show"
								checked={dontShowAgain.value}
								onChange$={$((e) => {
									dontShowAgain.value = (e.target as HTMLInputElement).checked;
								})}
							/>
							<label for="dont-show" class="ml-2">
								Don’t show again
							</label>
						</div>

						<div class="flex justify-end">
							<button class="px-3 py-1 bg-gray-200 rounded" onClick$={handleClose}>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
