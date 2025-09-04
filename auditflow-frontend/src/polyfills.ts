/***************************************************************************************************
 * BROWSER POLYFILLS
 */

// Import Zone.js required by Angular
import 'zone.js';  // Included with Angular CLI.

/***************************************************************************************************
 * CUSTOM POLYFILLS
 */
(window as any).global = window;

import { Buffer } from 'buffer';
(window as any).Buffer = Buffer;
(window as any).process = { env: {} };
