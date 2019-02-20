/* HttpClient modifier (ordered) */
export {
  RequestCache, RequestCacheWithMap, RequestCacheWithStorage,
  RequestCacheWithMapStorage,
} from './request-cache/request-cache';
export { httpInterceptorProviders } from './http-interceptors';

/* User providers */
export { AppAnimationProvider } from './app-animation';
export { BusTrackingProvider } from './bus-tracking';
export { CasTicketProvider } from './cas-ticket';
export { DataCollectorProvider } from './data-collector';
export { FeedbackProvider } from './feedback';
export { IntakeListingProvider } from './intake-listing';
export { NewsProvider } from './news';
export { NotificationProvider } from './notification';
export { SettingsProvider } from './settings';
export { SlotsProvider } from './slots';
export { TimetableProvider } from './timetable';
export { UpcomingConLecProvider } from './upcoming-con-lec';
export { UpcomingConStuProvider } from './upcoming-con-stu';
export { UserSettingsProvider } from './user-settings';
export { UserserviceProvider } from './userservice';
export { VersionProvider } from './version';
export { WsApiProvider } from './ws-api';
