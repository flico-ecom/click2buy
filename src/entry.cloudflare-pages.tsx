/**
 * WHAT IS THIS FILE?
 *
 * Cloudflare Pages entry point for the Qwik City app.
 *
 * This file is used by Cloudflare Pages to handle requests.
 *
 */
import { renderToStream, type RenderToStreamOptions } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import Root from './root';

export default function (opts: RenderToStreamOptions) {
	return renderToStream(<Root />, {
		manifest,
		...opts,
	});
}
