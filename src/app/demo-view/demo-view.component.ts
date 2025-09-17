import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGX_GRID_DIRECTIVES, IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from '@infragistics/igniteui-angular';
import { Subject, take, takeUntil } from 'rxjs';
import { CustomerDto } from '../models/northwind-swagger/customer-dto';
import { OrderDto } from '../models/northwind-swagger/order-dto';
import { NorthwindSwaggerService } from '../services/northwind-swagger.service';

@Component({
  selector: 'app-demo-view',
  imports: [IGX_LIST_DIRECTIVES, IGX_GRID_DIRECTIVES, IgxAvatarComponent, IgxIconComponent],
  templateUrl: './demo-view.component.html',
  styleUrls: ['./demo-view.component.scss']
})
export class DemoViewComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();

  private _selectedCustomer?: CustomerDto;
  public get selectedCustomer(): CustomerDto | undefined {
    return this._selectedCustomer;
  }
  public set selectedCustomer(value: CustomerDto | undefined) {
    this._selectedCustomer = value;
    this.northwindSwaggerOrderDto$.next();
  }
  public northwindSwaggerCustomerDto: CustomerDto[] = [];
  public northwindSwaggerOrderDto: OrderDto[] = [];
  public northwindSwaggerOrderDto$: Subject<void> = new Subject<void>();

  constructor(
    private northwindSwaggerService: NorthwindSwaggerService,
  ) {}


  ngOnInit() {
    this.northwindSwaggerService.getCustomerDtoList().pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindSwaggerCustomerDto = data
    );
    this.northwindSwaggerService.getOrderDtoList(this.selectedCustomer?.customerId ?? '').pipe(takeUntil(this.destroy$)).subscribe(
      data => this.northwindSwaggerOrderDto = data
    );
    this.northwindSwaggerOrderDto$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.northwindSwaggerService.getOrderDtoList(this.selectedCustomer?.customerId ?? '').pipe(take(1)).subscribe(
        data => this.northwindSwaggerOrderDto = data
      );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.northwindSwaggerOrderDto$.complete();
  }
}
