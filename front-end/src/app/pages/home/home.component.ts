import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MatExpansionModule, CommonModule, MatIconModule, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly panelStates = {
    doctors: signal(false),
    patients: signal(false),
    appointments: signal(false)
  };

  link: string = '';

  constructor() { }

  setLink(panel: string) {
    this.link = panel;
  }

  getBorderRadius(panel: keyof typeof this.panelStates) {
    return this.panelStates[panel]() ? '5px' : '100px';
  }
}
