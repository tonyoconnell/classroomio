import { PostHog } from 'posthog-node';

export const client = new PostHog(
  'phc_JfdHOZ6v0cVlGELphc_JBCPGk7bgT9CLOS6uUCSqNGz1HViiIIgW1tiwUtPXu1',

  { host: 'https://app.posthog.com' }
);

await client.shutdownAsync();
