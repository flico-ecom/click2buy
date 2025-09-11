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
				<div class="fixed inset-0 z-[2000] flex items-center justify-center bg-black bg-opacity-50">
					<div
						class={`
              bg-white rounded-lg shadow-xl w-full max-w-md transform transition-transform duration-300 ease-out
              ${animateIn.value ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}
            `}
					>
						<div class="flex flex-col items-center p-6">
							<img src="/logo.svg" alt="Logo" class="h-16 w-16 mb-4" />
							<h2 class="text-2xl font-bold text-primary-700 mb-2">Join Our Newsletter!</h2>
							<p class="text-center text-gray-700 mb-6">
								Subscribe to get the latest updates, exclusive offers, and more directly in your
								inbox.
							</p>

							<input
								type="email"
								placeholder="Enter your email"
								class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
							/>

							<button class="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700 transition-colors duration-300 mb-4">
								Subscribe
							</button>

							<div class="flex items-center mb-4">
								<input
									type="checkbox"
									id="dont-show"
									checked={dontShowAgain.value}
									onChange$={$((e) => {
										dontShowAgain.value = (e.target as HTMLInputElement).checked;
									})}
									class="form-checkbox h-4 w-4 text-primary-600 transition duration-150 ease-in-out"
								/>
								<label for="dont-show" class="ml-2 text-gray-600">
									Don’t show again
								</label>
							</div>

							<button
								class="text-gray-500 hover:text-gray-700 transition-colors duration-300"
								onClick$={handleClose}
							>
								No, thanks
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
});
