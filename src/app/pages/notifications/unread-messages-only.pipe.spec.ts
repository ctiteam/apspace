import { UnreadMessagesOnlyPipe } from './unread-messages-only.pipe';

describe('UnreadMessagesOnlyPipe', () => {
  it('create an instance', () => {
    const pipe = new UnreadMessagesOnlyPipe();
    expect(pipe).toBeTruthy();
  });
});
