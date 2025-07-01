import { Slot, component$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

interface IProps {
	title: string;
	close: PropFunction<() => void>;
}

export const NewsletterModal = component$(({ title, close }: IProps) => {
	return (
		<>
			<div class="fixed z-50 inset-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center">
				<div class="relative bg-white rounded-lg shadow-lg w-full max-w-lg z-40">
					<div class="flex justify-between items-center p-4 border-b border-gray-300">
						<h2 id="modal-title" class="text-lg font-semibold text-black">
							{title}
						</h2>
						<button
							class="text-black text-xl font-bold hover:text-gray-500 border rounded-full p-1"
							onClick$={close}
							aria-label="Close modal"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div class="p-4 text-black">
						<Slot name="content" />
					</div>

					<div class="p-4 border-t border-gray-300 text-black">
						<h1>modal footer</h1>
					</div>
				</div>
			</div>
		</>
	);
});
