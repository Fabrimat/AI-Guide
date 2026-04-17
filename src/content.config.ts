import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      // Campi custom aggiunti al frontmatter delle lezioni.
      // `livello`    = pubblico target della pagina (consumato dalla skill
      //                `analyze-lesson` per simulare il lettore).
      // `prerequisiti` = slug di altre lezioni che si assume il lettore abbia già letto.
      extend: z.object({
        livello: z.enum(['principiante', 'intermedio', 'avanzato']).optional(),
        prerequisiti: z.array(z.string()).optional(),
      }),
    }),
  }),
};
