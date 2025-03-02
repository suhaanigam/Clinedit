import { Component } from '@angular/core';

@Component({
  selector: 'app-second-tab-display',
  imports: [],
  templateUrl: './second-tab-display.component.html',
  styleUrl: './second-tab-display.component.css'
})

export class SecondTabDisplayComponent {
  tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  selectedTab: string = this.tabs[0];

  getDisplayContent(): string {
    switch (this.selectedTab) {
      case 'Tab 1':
        return 'We offer automated analysis of results';
      case 'Tab 2':
        return 'We assist with project organisation';
      case 'Tab 3':
        return 'We can reduce downtime and schedule people when there are nurses free';
      default:
        return 'Please select a tab.';
    }
  }

  setActiveTab(tab: string) {
    this.selectedTab = tab;
  }
}
