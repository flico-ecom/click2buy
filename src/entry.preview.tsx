/*
 * WHAT IS THIS FILE?
 *
 * It's the bundle entry point for `pnpm preview`.
 * That is, serving your app built in production mode.
 *
 * Feel free to modify this file, but don't remove it!
 *
 * Learn more about Vite's preview command:
 * - https://vitejs.dev/config/preview-options.html#preview-options
 *
 */
import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import render from './entry.ssr';
import qwikCityPlan from '@qwik-city-plan';

export default createQwikCity({ render, qwikCityPlan });
