import { proxyMenu } from '../../_shared/dishkai.js';
export const onRequest = ({ request }) => proxyMenu(request, 'text');
