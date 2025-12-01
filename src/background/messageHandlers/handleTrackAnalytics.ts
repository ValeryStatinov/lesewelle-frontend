import type { TrackAnalyticsMessage } from 'core/chromeMessages/messages';
import { trackEvent } from 'core/lib/amplitude/amplitude';

import type { ExtensionMessageHandler } from './types';

export const handleTrackAnalytics: ExtensionMessageHandler<TrackAnalyticsMessage> = async (message) => {
  trackEvent(message.payload.type, message.payload.properties);
};
