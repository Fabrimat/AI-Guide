/**
 * Static lesson data for the Recap / ReviewToday prompts and the progress
 * page: `dist/recap/<locale>.json`. Same-origin file, fetched on demand by
 * `src/scripts/recap-prompt.ts`. Included in the PWA bulk manifest (offline
 * for installed users), never in the Workbox precache.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getLessonData } from '../../lib/lesson-data';

export const getStaticPaths = (() => [
  { params: { locale: 'it' } },
  { params: { locale: 'en' } },
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const locale = params.locale === 'it' ? 'it' : 'en';
  const lessons = await getLessonData(locale);
  return new Response(JSON.stringify(lessons), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
