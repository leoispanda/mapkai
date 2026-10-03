import { proxyDishImage } from '../../_shared/dishkai.js';
export const onRequest = ({ request }) => proxyDishImage(request);
