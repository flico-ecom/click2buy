import { component$ } from '@builder.io/qwik';

export default component$(() => {
	return (
		<>
			<div class="container mx-auto px-4 py-12 max-w-4xl">
				<h1 class="text-3xl font-bold mb-8">Return & Refund Policy</h1>

				<div class="prose max-w-none">
					<p class="text-sm text-muted-foreground mb-8">Last Updated: May 11, 2025</p>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">1. Introduction</h2>
						<p>
							At Click2Buy.lk, we want you to be completely satisfied with your purchase. We
							understand that sometimes you may need to return an item. This Return & Refund Policy
							outlines our procedures and guidelines for returns, exchanges, and refunds.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">2. Return Eligibility</h2>
						<p>To be eligible for a return, your item must meet the following conditions:</p>
						<ul class="list-disc pl-6 mb-4">
							<li>
								The item must be returned within 14 days of delivery (the &quot;Return
								Period&quot;).
							</li>
							<li>
								The item must be unused, unworn, unwashed, and in the same condition that you
								received it.
							</li>
							<li>The item must be in its original packaging with all tags attached.</li>
							<li>You must have the receipt or proof of purchase.</li>
						</ul>

						<h3 class="text-xl font-medium mt-6 mb-3">2.1 Non-Returnable Items</h3>
						<p>The following items cannot be returned:</p>
						<ul class="list-disc pl-6 mb-4">
							<li>Perishable goods such as food, flowers, or plants</li>
							<li>Gift cards or vouchers</li>
							<li>Downloadable software products</li>
							<li>Personal care items and cosmetics (if opened or used)</li>
							<li>Intimate apparel, swimwear, and undergarments (for hygiene reasons)</li>
							<li>Hazardous materials, flammable liquids, or gases</li>
							<li>Custom-made or personalized items</li>
							<li>
								Items marked as &quot;Final Sale,&quot; &quot;Non-Returnable,&quot; or
								&quot;As-Is&quot;
							</li>
						</ul>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">3. Return Process</h2>
						<p>To initiate a return, please follow these steps:</p>
						<ol class="list-decimal pl-6 mb-4">
							<li>
								<strong>Contact Our Customer Service:</strong> Email us at returns@click2buy.lk or
								call our customer service at [Your Phone Number] to request a return. Please include
								your order number and the reason for your return.
							</li>
							<li>
								<strong>Receive Return Authorization:</strong> Wait for our confirmation email with
								return instructions and a Return Merchandise Authorization (RMA) number.
							</li>
							<li>
								<strong>Package Your Return:</strong> Securely pack the item(s) in their original
								packaging along with all accessories, manuals, and free gifts that came with the
								product.
							</li>
							<li>
								<strong>Include Return Form:</strong> Place the return form (which will be provided
								in the confirmation email) inside the package.
							</li>
							<li>
								<strong>Ship Your Return:</strong> Send your package to the address provided in the
								return instructions. We recommend using a trackable shipping service.
							</li>
						</ol>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">4. Refunds</h2>
						<p>
							Once we receive and inspect your return, we will notify you about the status of your
							refund.
						</p>

						<h3 class="text-xl font-medium mt-6 mb-3">4.1 Refund Processing</h3>
						<p>
							If your return is approved, we will initiate a refund to your original method of
							payment. The time it takes for the refund to appear in your account depends on your
							payment provider&apos;s processing times:
						</p>
						<ul class="list-disc pl-6 mb-4">
							<li>Credit/Debit Cards: 5-10 business days</li>
							<li>Bank Transfers: 3-7 business days</li>
							<li>Digital Wallets (e.g., PayPal): 1-3 business days</li>
						</ul>

						<h3 class="text-xl font-medium mt-6 mb-3">4.2 Refund Amount</h3>
						<p>
							Your refund will include the purchase price of the returned item(s) and any applicable
							taxes. Shipping charges are non-refundable unless the return is due to our error
							(e.g., you received an incorrect or defective item).
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">5. Exchanges</h2>
						<p>
							If you need to exchange an item for a different size, color, or product, please follow
							the return process above and place a new order for the desired item. This ensures you
							get the item you want without delay, especially if inventory is limited.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">6. Return Shipping Costs</h2>
						<p>
							Customers are responsible for return shipping costs unless the return is due to our
							error (e.g., you received an incorrect or defective item). In such cases, we will
							provide a prepaid shipping label or reimburse your shipping costs.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">7. Damaged or Defective Items</h2>
						<p>
							If you receive a damaged or defective item, please contact us within 48 hours of
							delivery. Please provide photos of the damaged item and packaging to help us process
							your claim quickly.
						</p>
						<p>For damaged or defective items, we offer the following options:</p>
						<ul class="list-disc pl-6 mb-4">
							<li>Full refund</li>
							<li>Replacement of the same item (subject to availability)</li>
							<li>Store credit for the full amount</li>
						</ul>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">8. Late or Missing Refunds</h2>
						<p>
							If you haven&apos;t received your refund within the timeframe mentioned above, please
							check your bank account again and then contact your credit card company or bank, as it
							may take some time for the refund to be officially posted.
						</p>
						<p>
							If you&apos;ve done this and still haven&apos;t received your refund, please contact
							our customer service at returns@click2buy.lk.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">9. Sale Items</h2>
						<p>
							Items on sale can be returned according to our standard return policy unless
							specifically marked as &quot;Final Sale&quot; or &quot;Non-Returnable.&quot;
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">10. Gifts</h2>
						<p>
							If the item was marked as a gift when purchased and shipped directly to you,
							you&apos;ll receive a gift credit for the value of your return. Once the returned item
							is received, a gift certificate will be emailed to you.
						</p>
						<p>
							If the item wasn&apos;t marked as a gift when purchased, or the gift giver had the
							order shipped to themselves to give to you later, we will send the refund to the gift
							giver.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
						<p>
							We reserve the right to modify this Return & Refund Policy at any time. Changes will
							be effective immediately upon posting to our website. It is your responsibility to
							review this policy periodically for changes.
						</p>
					</section>

					<section class="mb-8">
						<h2 class="text-2xl font-semibold mb-4">12. Contact Us</h2>
						<p>If you have any questions about our Return & Refund Policy, please contact us:</p>
						<div class="mt-4">
							<p>
								<strong>Click2Buy.lk</strong>
							</p>
							<p>Email: legal@click2buy.lk</p>
							<p>Phone: +94 11 2 866 676</p>
							<p>Address: No. 464C, Pannipitiya Road, Pelawatte, Battaramulla.</p>
						</div>
					</section>
				</div>

				<div class="mt-12 border-t pt-6">
					<a href="/" class="text-primary hover:underline">
						Return to Home
					</a>
				</div>
			</div>
		</>
	);
});
