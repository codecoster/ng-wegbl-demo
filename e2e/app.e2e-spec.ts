import { NgWebglPage } from './app.po';

describe('ng-webgl App', () => {
  let page: NgWebglPage;

  beforeEach(() => {
    page = new NgWebglPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
