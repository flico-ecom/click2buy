import { component$, useVisibleTask$, useSignal, $, useTask$ } from '@builder.io/qwik';
import { AdBanner } from '~/types';
import { fetchContentfulEntries } from '~/utils/contentful';

export default component$(() => {
	const visible = useSignal(false);
	const currentAd = useSignal(0);
	const contentfulData = useSignal<AdBanner[]>([]);

	const getRandomDelay = $(() => {
		const min = 30000; // 30 second
		const max = 1 * 60 * 1000; // 1 minutes
		return Math.floor(Math.random() * (max - min + 1) + min);
	});

	useTask$(async () => {
		try {
			const entries = await fetchContentfulEntries('adBanner');
			contentfulData.value = entries as unknown as AdBanner[];
		} catch (error) {
			console.error('Error fetching Contentful data:', error);
		}
	});

	useVisibleTask$(async ({ track, cleanup }) => {
		track(() => contentfulData.value);
		if (contentfulData.value.length === 0) {
			return;
		}
		let mainTimer: NodeJS.Timeout;
		let hideTimer: NodeJS.Timeout;

		const schedulePopup = async () => {
			const delay = Math.random() > 0.5 ? await getRandomDelay() : 30 * 1000;
			mainTimer = setTimeout(async () => {
				currentAd.value = Math.floor(Math.random() * contentfulData.value.length);
				visible.value = true;
				hideTimer = setTimeout(() => {
					visible.value = false;
					schedulePopup(); // Schedule next popup after hiding
				}, 15000);
			}, delay);
		};

		// Initial call to schedule the first popup
		schedulePopup();

		// Cleanup function for all timers
		cleanup(() => {
			clearTimeout(mainTimer);
			clearTimeout(hideTimer);
		});
	});

	return (
		<>
			<div
				class={`fixed top-36 right-6 z-[9000] bg-white shadow-xl rounded-2xl w-96 transform transition-transform 
                        duration-500 ease-in-out ${
													visible.value ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
												}`}
			>
				{contentfulData.value.length > 0 && (
					<a href={contentfulData.value[currentAd.value].fields.redirectionLink} target="_blank">
						<img
							src={`https:${contentfulData.value[currentAd.value].fields.adImage.fields.file.url}`}
							alt="Advertisement"
							class="rounded-lg w-full"
						/>
					</a>
				)}
				<button
					onClick$={() => (visible.value = false)}
					class="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
				>
					✕
				</button>
			</div>
		</>
	);
});
