import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = pathToFileURL(`${path.resolve(import.meta.dirname, "..")}/`).href;

/**
 * Lets the asset scripts import `lib/*.ts` directly, so generated assets are
 * derived from the same records the site renders instead of a second copy.
 *
 * Node strips the types on its own; what it will not do is guess the extension
 * on `./workProjects` or expand the `@/` alias, which is all this adds.
 */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    return next(new URL(specifier.slice(2), ROOT).href, context);
  }

  try {
    return await next(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && !path.extname(specifier)) {
      return next(`${specifier}.ts`, context);
    }
    throw error;
  }
}
