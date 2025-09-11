import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';
import { date } from 'zod';

export default component$(() => {
	const year = new Date().getFullYear();
	return (
		<footer class="">
			{/* Top Bar */}
			<div class="border-[#262261] border border-x-0  text-white py-4 px-4">
				{/* <div class="max-w-6xl  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-sm">
					<div class="flex items-center justify-center md:justify-start">
						<span class="text-lg">Customer Support 8.00.AM - 5.00.PM</span>
					</div>
					<div class="flex items-center justify-center md:justify-start">
						<span class="text-lg">Flexiable payment options</span>
					</div>
					<div class="flex items-center justify-center md:justify-start">
						<span class="text-lg">Island wide Delivery</span>
					</div>
					<div class="flex items-center justify-center md:justify-start">
						<span class="text-lg">100% Authentic Products</span>
					</div>
					<div class="flex items-center justify-center md:justify-start">
						<span class="text-lg">After Service</span>
					</div>
				</div> */}
				<div class="flex flex-1 justify-end md:justify-center gap-4 mb-4 md:mb-0">
					{/* Placeholder for bank logos */}
					<Image
						src="/assets/svg/visa.svg"
						alt="Visa"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/mastercard.svg"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/nationstrust.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/commercial.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/hnb.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/cargills.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/dfcc.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/peoples.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/seylan.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/sampath.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/union.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					<Image
						src="/assets/svg/panasia.png"
						alt="Mastercard"
						width={40}
						height={25}
						layout="constrained"
					/>
					{/* Add more bank logos here as Image components if available */}
				</div>
			</div>

			{/* Main Footer Content */}
			<div class="bg-white py-12  px-4 sm:px-6 lg:py-8 lg:px-8">
				<div class="max-w-6xl mx-auto  grid grid-cols-2 md:grid-cols-4 gap-4">
					{/* Contact Information */}
					<div class="flex flex-col space-y-4">
						<div class="text-sm">
							<p>No. 464/C</p>
							<p>Pannipitiya Road,</p>
							<p>Pelawatta,</p>
							<p>Battaramulla</p>
						</div>
						<div>
							<p class="text-sm font-semibold">HOTLINE</p>
							<p class="text-xl font-bold">011 246 46 46</p>
							<p class="text-xl font-bold">071 246 46 46</p>
						</div>
						{/* <div class="flex space-x-4">
							<a href="#" aria-label="Facebook">
								<Image src="/public/assets/svg/facebook.svg" alt="Facebook" width={25} height={25} layout="constrained" />
							</a>
							<a href="#" aria-label="WhatsApp">
								<Image src="/public/assets/svg/whatsapp.svg" alt="WhatsApp" width={25} height={25} layout="constrained" />
							</a>
						</div> */}
					</div>

					{/* About Column */}
					<div>
						<h3 class="font-semibold text-lg mb-4">About</h3>
						<ul class="space-y-2 text-sm">
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									About Us
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Careers
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Contact Us
								</a>
							</li>
						</ul>
					</div>

					{/* Help Column */}
					<div>
						<h3 class="font-semibold text-lg mb-4">Help</h3>
						<ul class="space-y-2 text-sm">
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Frequently Asked Questions
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Shipping & Delivery
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Warranty Information
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Return Products
								</a>
							</li>
						</ul>
					</div>

					{/* Policies Column */}
					<div>
						<h3 class="font-semibold text-lg mb-4">Policies</h3>
						<ul class="space-y-2 text-sm">
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Privacy policy
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Replacement policy
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Refund policy
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Return policy
								</a>
							</li>
							<li>
								<a href="#" class="text-gray-700 hover:text-purple-800">
									Term and conditions
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Payment Methods / Copyright */}
			<div class="bg-white py-4 flex border-t border-[#262261] px-4 sm:px-6 lg:px-8">
				<div class="max-w-6xl mx-auto  justify-center items-center">
					<div class="text-sm text-gray-600">
						Copyright ©{year} Click2Buy.lk All Rights Reserved.
					</div>
				</div>
			</div>
		</footer>
	);
});
