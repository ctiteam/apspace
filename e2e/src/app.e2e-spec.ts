import { AppPage } from './app.po';

describe('new App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should direct to login page', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toContain('Your digital university companion');
  });
});
