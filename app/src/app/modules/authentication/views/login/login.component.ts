import { Component, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";

@Component({
    templateUrl: "./login.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginViewComponent {

    loginForm: FormGroup = this.fb.group({
        username: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    })

    constructor(
        private readonly fb: FormBuilder,
        private readonly router: Router,
        private readonly authService: AuthenticationService
    ) {}

    submitForm() {
        if (this.loginForm.invalid) return

        const input = {
            username: this.loginForm.value.username,
            password: this.loginForm.value.password
        }

        this.authService.login(input.username, input.password).subscribe(x => {
            if(typeof x?.data?.token === "string") {
                this.router.navigate(["/"]);
                return;
            }

            
        });
    }
}