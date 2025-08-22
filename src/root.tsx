import { $, component$, useOnDocument, useStyles$, useVisibleTask$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { Head } from './components/head/head';
import { useToastProvider } from './components/toast/ToastContext';
import globalStyles from './global.css?inline';
import { useI18n } from './utils/i18n';
const chatbotUrl = import.meta.env.VITE_CHAT_WEBHOOK_URL;

export default component$(() => {
	/**
	 * The root of a QwikCity site always start with the <QwikCityProvider> component,
	 * immediately followed by the document's <head> and <body>.
	 *
	 * Don't remove the `<head>` and `<body>` elements.
	 */
	useStyles$(globalStyles);
	useOnDocument('qinit', $(useI18n));
	useToastProvider();
	useVisibleTask$(() => {
		// Attach the config to window
		(window as any).ChatWidgetConfig = {
			webhook: { url: chatbotUrl, route: 'general' },
			branding: {
				logo: `/logo.svg`,
				name: 'Click2buy Ai Assistant',
				welcomeText: 'Welcome to Click2buy.lk! How can we help you today?',
				chatstbutton: 'Click & Ask',
				responseTimeText: 'Click the button below to start chatting with our support team',
				registrationtitle: 'Sign In',
				buttontext: 'Click2Buy AI',
			},
			style: {
				primaryColor: '#262261', //
				secondaryColor: '#4f46e5', //
				accentColor: '#f97316', // Orange to match your promotional banner
				position: 'right',
				backgroundColor: '#ffffff',
				fontColor: '#1e293b', // Dark slate for better readability
				headerColor: '#6366f1', // Purple header
				headerTextColor: '#ffffff', // White text on purple header
			},
			// Add suggested questions that users can click
			suggestedQuestions: ['I am looking for...?'],
		};

		// Inject script dynamically
		const script = document.createElement('script');
		script.src = '/js/chatbot.js';
		document.body.appendChild(script);
	});

	return (
		<QwikCityProvider>
			<Head />
			<body lang="en">
				<RouterOutlet />

				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
