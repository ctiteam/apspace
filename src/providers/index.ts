/* HttpClient modifier (ordered) */

export {
  RequestCache, RequestCacheWithMap, RequestCacheWithStorage,
  RequestCacheWithMapStorage,
} from './request-cache/request-cache';
export { httpInterceptorProviders } from './http-interceptors';

/* User providers */
export { BusTrackingProvider } from './bus-tracking';
export { CasTicketProvider } from './cas-ticket';
export { DataCollectorProvider } from './data-collector';
export { FeedbackProvider } from './feedback';
export { NewsProvider } from './news';
export { NotificationProvider } from './notification';
export { SettingsProvider } from './settings';
export { SlotsProvider } from './slots';
export { TimetableProvider } from './timetable';
export { UpcomingConLecProvider } from './upcoming-con-lec';
export { UpcomingConStuProvider } from './upcoming-con-stu';
export { UserserviceProvider } from './userservice';
export { WsApiProvider } from './ws-api';
export { UserSettingsProvider } from './user-settings';
export { AppAnimationProvider } from './app-animation';
