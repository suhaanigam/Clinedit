import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GlowscriptComponent } from './glowscript/glowscript.component';
import { TabDisplayComponent } from './tab-display/tab-display.component'
import { SecondTabDisplayComponent } from './second-tab-display/second-tab-display.component'
import { FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GlowscriptComponent, TabDisplayComponent, SecondTabDisplayComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'ClinEdit';
  contactForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
      this.contactForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        comment: ['', Validators.required]
      });
  }

  submitForm() {
      if (this.contactForm.valid) {
        console.log('Form Data:', this.contactForm.value);
        this.submitted = true;
        this.contactForm.reset();
      }
  }

}
