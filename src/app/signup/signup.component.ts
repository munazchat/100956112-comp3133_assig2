import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { PassMatchValidator } from '../pass-match-validator';



const PROFILES = gql`
{
  profile{
    profiles{
      username,
      firstname,
      lastname,
      password,
      email,
      type
    }
  }
}
`;

const CREATE_PROFILE = gql`
mutation createProfile(
  $username: String,
  $firstname: String,
  $lastname: String,
  $password: String,
  $email: String,
  $type: String){
    createProfile(
      profileInput: {
      username: $username,
      firstname: $firstname,
      lastname: $lastname,
      password: $password,
      email: $email,
      type: $type
    }){
      username,
      firstname,
      lastname,
      password,
      email,
      type
    }
  }
`


@Component({
  selector: 'app-signnup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignnupComponent implements OnInit {
  profiles: Observable<any> | undefined;
  type: string = ""
  message: any
  data: any[] = []
  user: any;

  authForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(8)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    passwordConfirmation: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
    emailAddress: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
  }, {
    validators: [this.passMatchValidator.validate]
  })
  

  onSubmit() {
    if (this.authForm.invalid){
      console.error("Form invalid")
      return;
    }
    const { username, password, emailAddress } = this.authForm.value;

    // this.createProfile(username, "First", "Last", password, emailAddress);
  }


  constructor(
    private passMatchValidator: PassMatchValidator,
    private router: Router,
    private route: ActivatedRoute,
    private HttpClient: HttpClient,
    private apollo: Apollo) { }

  ngOnInit() {
    this.profiles = this.apollo.watchQuery({
      query: PROFILES
    }).valueChanges.pipe(
      map((result: any) => {
        console.log('data: ' + JSON.stringify(result.data.profile.profiles));
        return result.data.profile.profiles;
      })
    )

  }



  createProfile(username: string, firstname: string, lastname: string, password: string, email: string, type?: string) {
    type = this.type;
    console.log(
      username,
      firstname,
      lastname,
      password,
      email,
      type
    )
    this.apollo.mutate({
      mutation: CREATE_PROFILE,
      refetchQueries: [{ query: PROFILES }],
      variables: {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        email: email,
        type: type
      }
    }).subscribe(() => {
      this.message = "Registered ! Please Log In",
        this.router.navigate(['signin']);
    });
  }

  register(username: string, firstname: string, lastname: string, password: string, email: string, type?: string) {
    window.location.reload();
    this.profiles?.forEach((x: any) => x.find((e: any) => e.username === username ? (this.user = e.username) : null))
    if (this.user == 'underfine' || this.user === username) {
      this.message = 'Username is exits'
      this.router.navigate(['/']);
    }
    else {
      this.message = '';
      this.createProfile(username, firstname, lastname, password, email, type)
    }

  }

}
