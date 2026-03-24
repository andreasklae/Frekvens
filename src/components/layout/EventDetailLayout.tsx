import { EventChrome } from './EventChrome';
import { EventDetailPage } from '../../pages/EventDetailPage';

export function EventDetailLayout() {
  return (
    <div className="flex flex-col flex-1 min-h-screen w-full">
      <EventChrome />
      <div className="flex-1 w-full">
        <EventDetailPage />
      </div>
    </div>
  );
}
