import { $, component$, QRL, useContext, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import MD5 from 'crypto-js/md5';
import Swal from 'sweetalert2';
import { APP_STATE } from '~/constants';
import { ENV_VARIABLES } from '~/env';
import { getEligiblePaymentMethodsQuery } from '~/providers/shop/checkout/checkout';
import { EligiblePaymentMethods } from '~/types';
import { Button } from '../buttons/Button';
import CreditCardIcon from '../icons/CreditCardIcon';

export default component$<{ onForward$: QRL<(paymentMethodCode?: string) => void> }>(
	({ onForward$ }) => {
		const appState = useContext(APP_STATE);
		const paymentMethods = useSignal<EligiblePaymentMethods[]>();
		const isPopupOpen = useSignal(false);
		const paymentUrl = useSignal('');

		useVisibleTask$(async () => {
			paymentMethods.value = await getEligiblePaymentMethodsQuery();
			console.log('Eligible Payment Methods:', paymentMethods.value); // Debug log
			if (!paymentMethods.value || paymentMethods.value.length === 0) {
				Swal.fire({
					title: 'No Payment Methods Available',
					text: 'Please contact support for assistance.',
					icon: 'error',
					confirmButtonText: 'OK',
				});
			}
		});

		const handlePaymentSelection = $((code: string) => {
			appState.selectedPaymentMethodCode = code;
			const selectedMethod = paymentMethods.value?.find((method) => method.code === code);
			appState.selectedPaymentMethodName = selectedMethod ? selectedMethod.name : undefined;
		});

		const handlePayClick = $(async () => {
			console.log('handlePayClick initiated.'); // Debug log
			if (!appState.selectedPaymentMethodCode) {
				console.log('No payment method selected.'); // Debug log
				return;
			}

			console.log('Selected payment method:', appState.selectedPaymentMethodCode); // Debug log

			if (appState.selectedPaymentMethodCode === 'cash-on-delivery') {
				Swal.fire({
					title: 'Order Placed!',
					text: 'Your order has been placed. One of our team members will contact you within a few minutes to confirm this order before delivery.',
					icon: 'success',
					confirmButtonText: 'Noted !',
					customClass: {
						confirmButton: 'bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded',
					},
				}).then((result) => {
					if (result.isConfirmed) {
						// Simulate order placement and then navigate
						console.log('Paying with:', appState.selectedPaymentMethodCode);
						onForward$('cash-on-delivery');
					}
				});
			} else if (appState.selectedPaymentMethodCode === 'card-payment') {
				console.log('Initiating Card payment...'); // Debug log

				// Card payment
				const orderId = appState.activeOrder?.code || 'N/A';
				const totalWithTax = appState.activeOrder?.totalWithTax;

				if (typeof totalWithTax !== 'number' || isNaN(totalWithTax)) {
					console.error('Invalid totalWithTax amount:', totalWithTax);
					Swal.fire({
						title: 'Payment Error!',
						text: 'Invalid order amount. Please try again.',
						icon: 'error',
						confirmButtonText: 'OK',
					});
					return;
				}

				const amount = (totalWithTax / 100)?.toFixed(2) || '0.00'; // Convert from cents to LKR and format
				const currency = appState.activeOrder?.currencyCode || 'LKR';
				const API_URL = 'https://c2b-pay.coolify.flico.lk/api/paycenter';

				// TODO: Replace with dynamic data after testing
				const payload = {
					version: '1.5',
					msgId: crypto.randomUUID(),
					operation: 'PAYMENT_INIT',
					requestDate: new Date().toISOString(),
					validateOnly: false,
					requestData: {
						clientId: '14007313',
						clientIdHash: '',
						transactionType: 'PURCHASE',
						transactionAmount: {
							totalAmount: 0,
							paymentAmount: 200,
							serviceFeeAmount: 0,
							currency: 'LKR',
						},
						redirect: {
							returnUrl: 'https://c2b-pay.coolify.flico.lk/api/paycenter/return',
							cancelUrl: 'https://c2b-pay.coolify.flico.lk/api/paycenter/cancel',
							returnMethod: 'GET',
						},
						clientRef: 'ORDER123', // This should be dynamic
						comment: 'Test from HTML',
						tokenize: false,
						cssLocation1: '',
						cssLocation2: '',
						useReliability: true,
						extraData: {
							st_id: '123456',
							batch_id: '102348748',
							group: '1231458',
						},
					},
				};
				try {
					const res = await fetch(API_URL, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(payload),
					});
					const data = await res.json();
					if (data.responseData?.paymentPageUrl) {
						paymentUrl.value = data.responseData.paymentPageUrl;
						isPopupOpen.value = true;
					} else {
						Swal.fire({
							title: 'Payment Error!',
							text: 'Could not retrieve payment page. Please try again.',
							icon: 'error',
							confirmButtonText: 'OK',
						});
					}
				} catch (e) {
					Swal.fire({
						title: 'Payment Error!',
						text: 'An unexpected error occurred. Please try again.',
						icon: 'error',
						confirmButtonText: 'OK',
					});
				}
			} else {
				// For other payment methods, proceed as usual
				console.log('Paying with:', appState.selectedPaymentMethodCode);
				onForward$();
			}
		});

		return (
			<div class="flex flex-col space-y-10 items-center">
				{isPopupOpen.value && (
					<div class="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/60">
						<button
							onClick$={() => (isPopupOpen.value = false)}
							class="absolute top-5 right-8 z-[10000] flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-none bg-white text-3xl leading-none"
						>
							&times;
						</button>
						<iframe src={paymentUrl.value} class="h-screen w-screen border-none"></iframe>
					</div>
				)}
				<h2 class="text-lg font-medium text-gray-900 mb-4"> Select a payment method </h2>
				<div class="flex flex-col space-y-4">
					{paymentMethods.value?.map((method) => (
						<label key={method.code} class="flex items-center space-x-3 cursor-pointer">
							<input
								type="radio"
								name="paymentMethod"
								value={method.code}
								checked={appState.selectedPaymentMethodCode === method.code}
								onChange$={() => handlePaymentSelection(method.code)}
								class="form-radio h-5 w-5 text-primary-600"
							/>
							<span class="text-gray-700 text-base">
								{method.name}
								<CreditCardIcon extraClass="inline-block ml-2" />
							</span>
						</label>
					))}
				</div>
				<Button
					onClick$={handlePayClick}
					disabled={!appState.selectedPaymentMethodCode}
					extraClass="bg-primary-600 hover:bg-primary-700 flex w-full items-center justify-center space-x-2 mt-24 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-300"
				>
					{appState.selectedPaymentMethodName
						? `Proceed with ${appState.selectedPaymentMethodName}`
						: $localize`Proceed`}
				</Button>
			</div>
		);
	}
);
