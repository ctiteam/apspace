import { Pipe, PipeTransform } from '@angular/core';

import { QuixCustomer } from 'src/app/interfaces';

@Pipe({
  name: 'operationHoursFilter'
})
export class OperationHoursFilterPipe implements PipeTransform {

  transform(companies: QuixCustomer[], companyId: string): any {
    console.log('companies', companies);
    console.log('company id', companyId);
    return companies.find(company => company.company_id === companyId);
  }

}
