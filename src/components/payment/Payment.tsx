import { $, component$, QRL, useContext, useSignal, useVisibleTask$ } from '@qwik.dev/core';
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

		useVisibleTask$(async () => {
			paymentMethods.value = await getEligiblePaymentMethodsQuery();
			console.log('Eligible Payment Methods:', paymentMethods.value); // Debug log

			// Initialize PayHere
			if (typeof window !== 'undefined' && window.payhere) {
				window.payhere.onAndOff = true; // Enable sandbox mode for testing
				window.payhere.merchantId = ENV_VARIABLES.VITE_PAYHERE_MERCHANT_ID;

				// Payment completed. It can be a successful failure.
				window.payhere.onCompleted = async function onCompleted(orderId: string) {
					console.log('PayHere popup completed. Received Order ID:', orderId);
					// As per PayHere documentation, this callback triggers for both successful and failed payments.
					// The definitive payment status verification (using md5sig and status_code) must occur on the backend
					// via the 'notify_url' or after redirection to the 'return_url'.
					// Proceeding with onForward$ to advance the frontend checkout flow,
					// but the subsequent confirmation page/logic must handle backend verification.
					await onForward$('payhere');
				};

				// Payment window closed
				window.payhere.onDismissed = function onDismissed() {
					// Note: Prompt user to pay again or show an error page
					console.log('Payment dismissed');
				};

				// Error occurred
				window.payhere.onError = function onError(error: string) {
					console.error('PayHere Error Callback Triggered:', error); // More prominent error log
				};
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
			} else if (appState.selectedPaymentMethodCode === 'payhere') {
				console.log('Initiating PayHere payment...'); // Debug log

				// PayHere payment
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
				const merchantSecret = ENV_VARIABLES.VITE_PAYHERE_MERCHANT_SECRET;

				const hash = MD5(
					ENV_VARIABLES.VITE_PAYHERE_MERCHANT_ID +
						orderId +
						amount +
						currency +
						MD5(merchantSecret).toString().toUpperCase()
				)
					.toString()
					.toUpperCase();

				const payment = {
					sandbox: true,
					merchant_id: ENV_VARIABLES.VITE_PAYHERE_MERCHANT_ID,
					return_url: '/checkout/confirmation/success',
					cancel_url: '/checkout/confirmation/cancel',
					notify_url: 'http://localhost:8080/payment_verify/', // Keep as localhost for now, as it's a placeholder for a backend endpoint
					order_id: orderId,
					items:
						appState.activeOrder?.lines?.map((line) => line.productVariant.name).join(', ') ||
						'Order Items',
					amount: amount,
					currency: currency,
					first_name: appState.customer?.firstName || '',
					last_name: appState.customer?.lastName || '',
					email: appState.customer?.emailAddress || '',
					phone: appState.customer?.phoneNumber || '',
					address: `${appState.shippingAddress?.streetLine1 || ''}, ${appState.shippingAddress?.streetLine2 || ''}`,
					city: appState.shippingAddress?.city || '',
					country: appState.shippingAddress?.country || '',
					delivery_address: `${appState.shippingAddress?.streetLine1 || ''}, ${appState.shippingAddress?.streetLine2 || ''}`,
					delivery_city: appState.shippingAddress?.city || '',
					delivery_country: appState.shippingAddress?.country || '',
					custom_1: '',
					custom_2: '',
					hash: hash,
				};

				console.log('PayHere payment object:', payment); // Debug log before starting payment

				window.payhere.startPayment(payment);
			} else {
				// For other payment methods, proceed as usual
				console.log('Paying with:', appState.selectedPaymentMethodCode);
				onForward$();
			}
		});

		return (
			<div class="flex flex-col space-y-10 items-center">
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
