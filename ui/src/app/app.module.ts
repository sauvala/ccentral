import { BrowserModule } from '@angular/platform-browser';
import { NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ServicesService } from './services.service';
import { ServiceTreeviewComponent } from './service-treeview.component';
import { ServiceListComponent } from './service-list.component';
import { StatusBoxComponent } from './status-box.component';
import { InstanceListComponent } from './instance-list.component';
import { ServiceInfoComponent } from './service-info.component';
import { ConfigListComponent } from './config-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ServiceTreeviewComponent,
    ServiceListComponent,
    StatusBoxComponent,
    ServiceInfoComponent,
    InstanceListComponent,
    ConfigListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [ServicesService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
