import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;

  constructor( private auth:AuthService,
    private ui:UiService,
    private router:Router, 
    private formBuilder: FormBuilder
    ) { }

  ngOnInit() {
    
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
    this.auth.checkSession().then(sesion=>{
      this.router.navigate(['/home']);
    })
  }


  public async cerrarSesion(){
    await this.ui.showLoading();
    await this.auth.logOut();
    await this.ui.hideLoad();
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  public loginUser(value){
    this.auth.OnLogin(value)
    .then(res => {
      this.router.navigate(['/home']);
    })
    .catch(err=>{
      //meter alert
      this.ui.presentToast('Usuario o Contraseña incorrectos', 40000, 'danger');
    })
  }

  public async loginGoogle(){
    await this.ui.showLoading("Cargando...");
    this.auth.onTryLoginGoogle().then(res => {
        this.ui.hideLoad();
        console.log("##########################");
        console.log(res);
        this.auth.saveSesion(res);
        this.auth.isLogged = res;
        this.router.navigateByUrl('/home');
      })
      .catch(err => {
        console.log("Error aqui 3");
        console.log(err);
        this.auth.loginGoogle()
          .then(res => {
            this.auth.isLogged = res;
            this.ui.hideLoad();
            this.router.navigateByUrl('/home');
          })
          .catch(err => {
            this.ui.hideLoad();
            this.ui.presentToast(err, 4000, "danger");
          })

      })
    
  }

  public goToRegisterPage(){
    this.router.navigate(['/register']);
  }

}
