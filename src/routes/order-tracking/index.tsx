import { $, component$, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import XCircleIcon from '~/components/icons/XCircleIcon';

export default component$(() => {
	const navigate = useNavigate();
	const trackingNumber = useSignal('');
	const error = useSignal('');
	const message = useSignal('');

	const handleTrack = $(async () => {
		if (!trackingNumber.value.trim()) {
			error.value = 'Tracking number is required.';
			message.value = '';
			return;
		}
		// You can replace this with an API call
		message.value = `Tracking number "${trackingNumber.value}" submitted successfully.`;
		error.value = '';
		// Optionally navigate or fetch data here
		// navigate(`/tracking-result/${trackingNumber.value}`);
	});

	return (
		<div class="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div class="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 class="mt-6 text-center text-3xl title">Track Your Order</h2>
				<p class="mt-2 text-center text-sm text-gray-600 sub-title">
					Enter your tracking number to check the status of your order.
				</p>
			</div>

			<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div class="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
					<div class="space-y-6">
						<div>
							<label class="block text-sm font-medium text-gray-700">Tracking Number</label>
							<div class="mt-1">
								<input
									type="text"
									value={trackingNumber.value}
									required
									onInput$={(_, el) => (trackingNumber.value = el.value)}
									onKeyUp$={(ev, el) => {
										if (ev.key === 'Enter' && !!el.value) {
											handleTrack();
										}
									}}
									placeholder="e.g., AB123456789LK"
									class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
								/>
							</div>
						</div>

						{error.value !== '' && (
							<div class="rounded-md bg-red-50 p-4">
								<div class="flex">
									<div class="flex-shrink-0">
										<XCircleIcon />
									</div>
									<div class="ml-3">
										<p class="text-sm text-red-700 mt-2">{error.value}</p>
									</div>
								</div>
							</div>
						)}

						{message.value !== '' && (
							<div class="rounded-md bg-green-50 p-4">
								<p class="text-sm text-green-700">{message.value}</p>
							</div>
						)}

						<div>
							<button
								class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
								onClick$={handleTrack}
							>
								Track
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
