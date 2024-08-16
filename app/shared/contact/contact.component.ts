import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackendService } from '../../services/backend.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private bs: BackendService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.contactForm = this.fb.group({
      names: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      organisation: ['', Validators.required],
      number: ['', Validators.required],
      address: ['', Validators.required],
      message: [''],
    });

  }

  onSubmit(data: any) {
    console.log('Form values are as follows \n' + data);
    this.bs.sendMessage(data).subscribe(() => {
      alert('Your message has been sent.');
      this.contactForm.reset();
      // this.disabledSubmitButton = true;
    }, error => {
      console.log('Error', error);
    });
  }
}
