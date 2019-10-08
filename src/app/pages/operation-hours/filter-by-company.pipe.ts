import { Pipe, PipeTransform } from '@angular/core';
import { QuixCustomer } from 'src/app/interfaces';

@Pipe({
  name: 'filterByCompany'
})
export class FilterByCompanyPipe implements PipeTransform {

  transform(companies: QuixCustomer[], companyId: string): any {
    return companies.filter(company => company.company_id === companyId);
  }

}
