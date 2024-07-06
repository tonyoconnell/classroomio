import { dev } from '$app/environment';
import posthog from 'posthog-js';

export const capturePosthogEvent = (event: string, properties?: Record<string, unknown>): void => {
  if (dev) return;

  posthog.capture(event, properties);
};

export const identifyPosthogUser = (id: string, properties?: Record<string, unknown>): void => {
  if (dev) return;

  posthog.identify(id, properties);
};

export const initPosthog = (): void => {
  if (dev) return;

  posthog.init('TZovFN838p7kmdjdCtEjTZNjjm90OshMJ6nLBS2xMqw', {
    api_host: 'https://us.i.posthog.com'
  });
};
