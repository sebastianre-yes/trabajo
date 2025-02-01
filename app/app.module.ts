// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de importar el AppRoutingModule

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule], // Importa el AppRoutingModule aquí
  bootstrap: [AppComponent]
})
export class AppModule {}
