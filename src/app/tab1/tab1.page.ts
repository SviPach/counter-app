import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormsModule } from "@angular/forms"

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, FormsModule, IonInput, IonHeader, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class Tab1Page {
  count = 0;
  counterName = '';

  increment(): void{
    this.count++
  }

  decrement(): void{
    if (this.count > 0){
      this.count--;
    }
  }

  reset(): void{
    this.count = 0
  }
}
