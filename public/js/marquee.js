document.querySelectorAll('.marquee').forEach((marquee) => {
	const root = document.documentElement;
	const displayed = getComputedStyle(root).getPropertyValue('--marquee-elements-displayed');
	const content = marquee.querySelector('.marquee-content');

	root.style.setProperty('--marquee-elements', content.children.length);

	for (let i = 0; i < displayed; i++) {
		content.appendChild(content.children[i].cloneNode(true));
	}
});
