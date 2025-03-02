import { Component } from '@angular/core';

@Component({
  selector: 'app-tab-display',
  imports: [],
  templateUrl: './tab-display.component.html',
  styleUrl: './tab-display.component.css'
})

export class TabDisplayComponent {
  tabs = ['Tab 1', 'Tab 2', 'Tab 3'];
  selectedTab: string = this.tabs[0];

  getDisplayContent(): string {
    switch (this.selectedTab) {
      case 'Tab 1':
        return 'We help with tracking participants';
      case 'Tab 2':
        return 'We help with writing reports and with literature review';
      case 'Tab 3':
        return 'We help with compliance requirements';
      default:
        return 'Please select a tab.';
    }
  }

  setActiveTab(tab: string) {
    this.selectedTab = tab;
  }
}
