// One build entry keeps public pages on the same shell and source versions.
import { cp } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
await import('./build-finance-pages.mjs');
await import('./build-speaking.mjs');
await import('./build-toolbox.mjs');
for (const file of ['site-shell.css', 'site-shell.js', 'script.js', 'styles.css', 'finance-course.js', 'factory-review.html', 'factory-review.js']) {
  await cp(new URL(file, root), new URL(`public/${file}`, root));
}
await import('./update-asset-version.js');
console.log('Built all public UI with shared navigation, themes, and versioned assets.');
