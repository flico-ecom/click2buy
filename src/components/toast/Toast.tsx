// Toast.tsx
import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { useToast } from '~/components/toast/ToastContext';

export const Toast = component$(() => {
	const toast = useToast();
	const show = useSignal(false);

	useVisibleTask$(({ track }) => {
		track(() => toast.value.visible);
		if (toast.value.visible) {
			show.value = true;
			setTimeout(() => {
				show.value = false;
				setTimeout(() => {
					toast.value.visible = false;
				}, 0); // match transition duration
			}, 3000); // show for 3 seconds
		}
	});

	return (
		<div
			class={[
				'fixed top-5 right-5 bg-green-500 text-white px-4 py-2 min-w-[200px]  rounded transition-all duration-300',
				show.value && toast.value.visible
					? 'opacity-100 translate-x-0 scale-100'
					: 'opacity-0 translate-x-20 scale-75 pointer-events-none',
			]}
			style={{ zIndex: 9999, transformOrigin: 'right center' }}
		>
			{toast.value.message}
		</div>
	);
});
