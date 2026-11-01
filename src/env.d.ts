/// <reference types="@unplugin-pwa/core/vanillajs" />
/**
 * Globals iniettati a build time da `astro.config.mjs` via `vite.define`.
 * Vengono sostituiti letteralmente nel bundle prima del rendering, sia
 * server-side (frontmatter Astro) che client-side. Mostrati nel Footer
 * come "v <sha> · <build-time>".
 */
declare const __AIGUIDE_BUILD_SHA__: string;
declare const __AIGUIDE_BUILD_TIME__: string;

// Starlight 0.42 non pubblica più i tipi di questo modulo virtuale.
declare module 'virtual:starlight/project-context' {
  const project: { trailingSlash: 'always' | 'never' | 'ignore'; [key: string]: unknown };
  export default project;
}
