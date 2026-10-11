import { proxyDishkaiAuth } from '../../_shared/dishkai.js';

export const onRequest = ({ request, env = {} }) => proxyDishkaiAuth(request, env);
