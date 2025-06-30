/**
 * WHAT IS THIS FILE?
 *
 * Development entry point for the client-only app.
 *
 * When developing the client-only app, this file is used to create the browser build.
 *
 * - Client-only JS/CSS build
 * - Static assets
 * - Public assets
 * - Browser entry point, e.g. client.ts
 *
 */
import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

/**
 * The default export is the QwikCity adapter used by Vite dev server.
 */
export default function (opts: RenderOptions) {
	return render(document, <Root />, opts);
}
