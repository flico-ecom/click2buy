import { component$ } from '@qwik.dev/core';
import { Image } from 'qwik-image';

type IProps = {
	alt: string;
	imageSrc?: string;
	targetUrl: string;
};

export const AdBannerSimple = component$<IProps>(({ alt, imageSrc, targetUrl }: IProps) => {
	return (
		<a
			href={targetUrl}
			class="block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4"
		>
			<div class="relative w-full h-64">
				<Image
					src={imageSrc || '/placeholder.svg'}
					alt={alt}
					layout="constrained"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					class="md:object-cover object-contain w-full h-full"
					style="aspect-ratio: 16/9;"
				/>
			</div>
		</a>
	);
});
