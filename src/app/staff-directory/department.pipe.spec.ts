import { DepartmentPipe } from './department.pipe';

describe('DepartmentPipe', () => {
  it('create an instance', () => {
    const pipe = new DepartmentPipe();
    expect(pipe).toBeTruthy();
  });
});
