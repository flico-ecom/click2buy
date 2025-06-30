import { component$ } from '@builder.io/qwik';
import { Image } from 'qwik-image';

type IProps = {
	title: string;
	description: string;
	imageSrc?: string;
	ctaText: string;
	targetUrl: string;
	backgroundColor?: string;
	textColor?: string;
	buttonColor?: string;
};

export const AdBanner = component$<IProps>(
	({ title, description, imageSrc, ctaText, targetUrl }: IProps) => {
		return (
			<a
				href={targetUrl}
				class={`block w-full overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-orange-600`}
			>
				<div class="flex flex-col md:flex-row items-center">
					<div class="p-6 md:p-8 flex-1">
						<h2 class={`text-2xl md:text-3xl font-bold mb-2 text-white `}>{title}</h2>
						<p class={`mb-4 opacity-90 text-white`}>{description}</p>
						<button
							class={`px-6 py-2 rounded-full font-medium bg-white hover:opacity-90 transition-opacity`}
						>
							{ctaText}
						</button>
					</div>
					<div class="relative w-full md:w-2/5 h-64 md:h-auto min-h-64">
						<Image
							src={imageSrc}
							alt={title}
							class="object-cover w-full h-full"
							layout="fullWidth"
							style={{ aspectRatio: '4/3' }}
						/>
					</div>
				</div>
			</a>
		);
	}
);
