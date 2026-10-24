import { workShareResponse } from '../../_shared/work-share.js';

export function onRequest(context) {
  return workShareResponse({ ...context, kind: context.params.kind, id: context.params.id });
}
