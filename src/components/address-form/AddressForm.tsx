import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { APP_STATE } from '~/constants';
import { SRI_LANKA_LOCATIONS } from '~/constants/sri-lanka-locations';
import { ShippingAddress } from '~/types';

type IProps = {
	shippingAddress: ShippingAddress;
};

export default component$<IProps>(({ shippingAddress }) => {
	const appState = useContext(APP_STATE);
	const selectedProvince = useSignal(shippingAddress.province || '');
	const availableDistricts = useSignal<string[]>([]);

	useTask$(({ track }) => {
		track(() => selectedProvince.value);
		const provinceData = SRI_LANKA_LOCATIONS.find((loc) => loc.province === selectedProvince.value);
		availableDistricts.value = provinceData ? provinceData.districts : [];
		// If the current city is not in the newly selected province's districts, clear it
		if (shippingAddress.city && !availableDistricts.value.includes(shippingAddress.city)) {
			appState.shippingAddress = { ...appState.shippingAddress, city: '' };
		}
	});

	return (
		<div>
			<div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
				<div>
					<label html-for="fullName" class="block text-sm font-medium text-gray-700">
						{$localize`Full name`}
					</label>
					<div class="mt-1">
						<input
							type="text"
							id="fullName"
							name="fullName"
							value={shippingAddress.fullName}
							autoComplete="given-name"
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									fullName: el.value,
								};
							}}
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label html-for="company" class="block text-sm font-medium text-gray-700">
						{$localize`Company (Optional)`}
					</label>
					<div class="mt-1">
						<input
							type="text"
							name="company"
							id="company"
							value={shippingAddress.company}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									company: el.value,
								};
							}}
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label html-for="streetLine1" class="block text-sm font-medium text-gray-700">
						{$localize`Address Line 1`}
					</label>
					<div class="mt-1">
						<input
							type="text"
							name="streetLine1"
							id="streetLine1"
							value={shippingAddress.streetLine1}
							autoComplete="street-address"
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									streetLine1: el.value,
								};
							}}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						/>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label html-for="streetLine2" class="block text-sm font-medium text-gray-700">
						{$localize`Address Line 2 (Optional)`}
					</label>
					<div class="mt-1">
						<input
							type="text"
							name="streetLine2"
							id="streetLine2"
							value={shippingAddress.streetLine2}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									streetLine2: el.value,
								};
							}}
						/>
					</div>
				</div>

				<div>
					<label html-for="province" class="block text-sm font-medium text-gray-700">
						{$localize`Province`}
					</label>
					<div class="mt-1">
						<select
							id="province"
							name="province"
							value={selectedProvince.value}
							onChange$={(_, el) => {
								selectedProvince.value = el.value;
								appState.shippingAddress = {
									...appState.shippingAddress,
									province: el.value,
									city: '', // Clear city when province changes
								};
							}}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						>
							<option value="">{$localize`Select Province`}</option>
							{SRI_LANKA_LOCATIONS.map((loc) => (
								<option key={loc.province} value={loc.province}>
									{loc.province}
								</option>
							))}
						</select>
					</div>
				</div>

				<div>
					<label html-for="city" class="block text-sm font-medium text-gray-700">
						{$localize`City / District`}
					</label>
					<div class="mt-1">
						<select
							id="city"
							name="city"
							value={shippingAddress.city}
							onChange$={(_, el) => {
								appState.shippingAddress = { ...appState.shippingAddress, city: el.value };
							}}
							disabled={!selectedProvince.value}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						>
							<option value="">{$localize`Select City / District`}</option>
							{availableDistricts.value.map((district) => (
								<option key={district} value={district}>
									{district}
								</option>
							))}
						</select>
					</div>
				</div>

				<div class="sm:col-span-2">
					<label html-for="phoneNumber" class="block text-sm font-medium text-gray-700">
						{$localize`Phone Number`}
					</label>
					<div class="mt-1">
						<input
							type="text"
							name="phoneNumber"
							id="phoneNumber"
							value={shippingAddress.phoneNumber}
							autoComplete="tel"
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									phoneNumber: el.value,
								};
							}}
							class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
						/>
					</div>
				</div>
				<div class="sm:col-span-1">
					<label html-for="defaultShippingAddress" class="block text-sm font-medium text-gray-700">
						{$localize`Default Shipping Address`}
					</label>
					<div class="mt-1">
						<input
							type="checkbox"
							name="defaultShippingAddress"
							id="defaultShippingAddress"
							checked={shippingAddress.defaultShippingAddress}
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									defaultShippingAddress: el.checked,
								};
							}}
						/>
					</div>
				</div>
				<div class="sm:col-span-1">
					<label html-for="defaultBillingAddress" class="block text-sm font-medium text-gray-700">
						{$localize`Default Billing Address`}
					</label>
					<div class="mt-1">
						<input
							type="checkbox"
							name="defaultBillingAddress"
							id="defaultBillingAddress"
							checked={shippingAddress.defaultBillingAddress}
							onChange$={(_, el) => {
								appState.shippingAddress = {
									...appState.shippingAddress,
									defaultBillingAddress: el.checked,
								};
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
