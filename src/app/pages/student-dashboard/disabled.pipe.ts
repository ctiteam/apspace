import { Pipe, PipeTransform } from '@angular/core';
/**
 * Check if a dashbaord section is in the page or not
 */
@Pipe({
  name: 'disabled'
})
export class DisabledPipe implements PipeTransform {
  /**
   * Check if a dashbaord section is in the page or not
   *
   * @param dashboardSectionName Dashboard section name
   * @param addedDashboardSections List of dashboard sections added to the dasboard
   */
  transform(dashboardSectionName: string, addedDashboardSections: string[]): boolean {
    if (addedDashboardSections.indexOf(dashboardSectionName) === -1) {
      return false;
    }
    return true;
  }

}
