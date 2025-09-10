import { component$, useVisibleTask$ } from '@builder.io/qwik';

type MarqueeBrandProps = {
	images: string[];
};

export const MarqueeBrand = component$<MarqueeBrandProps>(({ images }) => {
	useVisibleTask$(() => {
		document.querySelectorAll('.marquee').forEach((marquee) => {
			const root = document.documentElement;
			const displayed = getComputedStyle(root).getPropertyValue('--marquee-elements-displayed');
			const content = marquee.querySelector('.marquee-content');

			if (content) {
				root.style.setProperty('--marquee-elements', content.children.length.toString());

				for (let i = 0; i < parseInt(displayed); i++) {
					content.appendChild(content.children[i].cloneNode(true));
				}
			}
		});
	});

	return (
		<>
			<div class="logo-row">
				<div class="marquee">
					<ul class="marquee-content">
						{images.map((image, index) => (
							<li key={index}>
								<img src={image} alt={`Branding Slide ${index + 1}`} />
							</li>
						))}
					</ul>
				</div>
			</div>
		</>
	);
});
