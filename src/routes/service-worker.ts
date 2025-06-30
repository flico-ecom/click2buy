/**
 * This file is left for the developer to customize to get the behavior they want for localization.
 * You can also use this file to add more functionality that runs in the service worker.
 */

// Basic service worker setup
addEventListener('install', () => {
	// Skip waiting for new service worker
	if ('skipWaiting' in self) {
		(self as any).skipWaiting();
	}
});

addEventListener('activate', () => {
	// Claim clients for new service worker
	if ('clients' in self && 'claim' in (self as any).clients) {
		(self as any).clients.claim();
	}
});
