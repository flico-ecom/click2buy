import { component$, useSignal } from '@builder.io/qwik';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon';

export default component$(() => {
	const faqs = [
		{
			id: 1,
			question: 'Do I need to create an account to purchase from Click2Buy.lk?',
			answer:
				'Yes, you need to create an account to complete your purchase on Click2Buy.lk. Having an account also helps you easily track your orders and manage your purchase history.',
		},
		{
			id: 2,
			question: 'How do I place an order online?',
			answer:
				'You can place an order by browsing products on Click2Buy.lk, adding items to your cart, and proceeding to checkout with your delivery and payment details.',
		},
		{
			id: 3,
			question: 'Can I modify or cancel my order after placing it?',
			answer:
				'Please contact our support team as soon as possible. Order modifications or cancellations depend on the order status and whether it has already been processed or shipped.',
		},
		{
			id: 4,
			question: 'What payment methods are accepted?',
			answer: 'Bank transfer, Koko, and PayHere.',
		},
		{
			id: 5,
			question: 'Do you offer installment payment plans?',
			answer: 'Yes, you can use the Koko payment option.',
		},
		{
			id: 6,
			question: 'How long does delivery take?',
			answer: '2–4 days.',
		},
		{
			id: 7,
			question: 'Is there a delivery charge?',
			answer:
				'Yes, all products have a delivery charge depending on the location. During the placement stage, you will be able to see the delivery charge.',
		},
		{
			id: 8,
			question: 'Can I track my order?',
			answer: 'Yes, you can track your order via a link.',
		},
		{
			id: 9,
			question: 'Do products come with a warranty?',
			answer: 'Yes, most of the products are covered by warranty.',
		},
		{
			id: 10,
			question: 'What is covered under warranty?',
			answer: 'It depends on the products.',
		},
		{
			id: 11,
			question: 'How do I claim a warranty or repair service?',
			answer: 'You can contact our Click2Buy.lk hotline – 00000000000.',
		},
		{
			id: 12,
			question: 'What is your return policy?',
			answer:
				'We accept returns within 7 days of delivery for eligible items. Products must be in original condition with all packaging.',
		},
		{
			id: 13,
			question: 'How do I request a return and refund?',
			answer:
				'Please contact our customer support hotline (XXXXXXXXX) with your order details to initiate the return and refund process.',
		},
		{
			id: 14,
			question: 'When will I receive my refund?',
			answer:
				'Refunds are typically processed within 7–14 business days after the returned product is received and inspected.',
		},
		{
			id: 15,
			question: 'Do you offer product demonstrations?',
			answer:
				'Currently, we do not offer live product demonstrations, but you can refer to the product descriptions, videos, and manuals available on the product page.',
		},
		{
			id: 16,
			question: 'What should I do if my product is damaged or stops working?',
			answer:
				'Contact our customer support hotline immediately for assistance and warranty claims.',
		},
		{
			id: 17,
			question: 'How do I place a bulk or corporate purchase?',
			answer:
				'Yes, bulk and corporate purchases are available. Please contact our hotline: 00000000 or info@click2buy.lk for support and special offers.',
		},
		{
			id: 18,
			question: 'Further Questions',
			answer: '',
		},
	];

	const openIndex = useSignal<number | null>(null);

	return (
		<div class="flex flex-col items-center justify-center p-4 ">
			<h1 class="text-2xl font-bold mb-4">Freaquently Asked Quections.</h1>
			<div class="w-full max-w-2xl">
				{faqs.map((faq, idx) => {
					const isOpen = openIndex.value === idx;
					return (
						<div key={faq.id} class="mb-2 border rounded overflow-hidden">
							<button
								type="button"
								class={`flex items-center justify-between w-full cursor-pointer px-4 py-3 font-medium bg-gray-100 hover:bg-gray-200 transition focus:outline-none`}
								aria-expanded={isOpen}
								onClick$={() => (openIndex.value = isOpen ? null : idx)}
							>
								<span>{faq.question}</span>
								<ChevronDownIcon />
							</button>
							<div
								class={`transition-all duration-300 bg-white border-t text-gray-700 px-4 overflow-hidden ${
									isOpen ? 'max-h-40 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'
								}`}
								style={{
									transitionProperty: 'max-height, opacity, padding',
								}}
							>
								{faq.answer}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
});
