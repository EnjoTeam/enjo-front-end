import { Injectable, NgZone } from '@angular/core';
import { User } from "../../object/user/user";
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertService } from 'ngx-alerts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: User; // Save logged in user data
  user$: Observable<User>;

  constructor(public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private alertService: AlertService
  ) {
    // Get the auth state, then fetch the Firestore user document or return null
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        // Logged in
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          // Logged out
          return of(null);
        }
      })
    )
  }

  // Sign in with email/password
  async signIn(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((value) => {
        if (value.user.emailVerified !== true) {
          this.sendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          const data = {
            uid: value.user.providerData[0].uid,
            email: value.user.email,
            displayName: value.user.displayName,
            photoURL: value.user.photoURL,
            role: "user"
          }
          localStorage.setItem('user', JSON.stringify(data));
          JSON.parse(localStorage.getItem('user'));
          this.router.navigate(['/dashboard/device']);
        }
      })
      .catch(error => this.alertService.danger(error));
  }

  // Sign up with email/password
  async signUp(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const data = {
          uid: this.afAuth.auth.currentUser.uid,
          email: email,
          password: password,
          displayName: 'User',
          photoURL: 'https://www.kindpng.com/picc/b/78-786207_avatar-png-icon.png',
          emailVerified: this.afAuth.auth.currentUser.emailVerified,
          company: '',
          location: '',
          role: "user"
        }
        this.updateUserData(data);
        this.sendVerificationMail();
      })
      .catch(error => this.alertService.danger(error));
  }

  async sendVerificationMail() {
    this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['/verify-email']);
      });
  }

  // Reset Forggot password
  async forgotPassword(passwordResetEmail) {
    this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch(error => this.alertService.danger(error));
  }

  async googleSignin() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then((value) => {
        const data = {
          uid: value.user.providerData[0].uid,
          email: value.user.email,
          displayName: value.user.displayName,
          photoURL: value.user.photoURL,
          role: "user"
        }
        localStorage.setItem('user', JSON.stringify(data));
        JSON.parse(localStorage.getItem('user'));
        this.router.navigate(['/dashboard/device']);
      })
      .catch(error => this.alertService.danger(error));
  }

  async googleSignup() {
    const provider = new auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithPopup(provider)
      .then((value) => {
        const data = {
          uid: value.user.uid,
          email: value.user.email,
          displayName: value.user.displayName,
          photoURL: value.user.photoURL,
          emailVerified: value.user.emailVerified,
          company: '',
          location: '',
          role: "user"
        }
        this.updateUserData(data);
        localStorage.setItem('user', JSON.stringify(value.user.providerData[0]));
        JSON.parse(localStorage.getItem('user'));
        this.router.navigate(['/dashboard/device']);
      })
      .catch(error => this.alertService.danger(error));
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  private updateUserData(user) {
    // Sets user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      company: user.company,
      location: user.company,
      role: user.role
    }

    return userRef.set(data, { merge: true })
  }

  // Sign out 
  async signOut() {
    localStorage.removeItem('user');
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  async updateImageUser(user, photo) {
    this.afs
      .collection('users')
      .doc(`/${user}`)
      .update({ photoURL: photo })
      .then(() => {
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  async updateNameUser(user, name) {
    this.afs
      .collection('users')
      .doc(`/${user}`)
      .update({ displayName: name })
      .then(() => {
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  async updateUser(user, name, company, location) {
    this.afs
      .collection('users')
      .doc(`/${user}`)
      .update({ displayName: name, company: company, location: location })
      .then(() => {
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  async signUpProvider(email, password, fullname, company, location) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        const data = {
          uid: this.afAuth.auth.currentUser.uid,
          email: email,
          password: password,
          emailVerified: this.afAuth.auth.currentUser.emailVerified,
          displayName: fullname,
          photoURL: 'https://www.kindpng.com/picc/b/78-786207_avatar-png-icon.png',
          company: company,
          location: location,
          role: "provider"
        }
        this.updateUserData(data);
        this.sendVerificationMail();
      })
      .catch(error => this.alertService.danger(error));
  }

  async signInProvider(email, password) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((value) => {
        if (value.user.emailVerified !== true) {
          this.sendVerificationMail();
          window.alert('Please validate your email address. Kindly check your inbox.');
        } else {
          const data = {
            uid: value.user.providerData[0].uid,
            email: value.user.email,
            displayName: value.user.displayName,
            photoURL: value.user.photoURL,
            role: "provider"
          }
          localStorage.setItem('user', JSON.stringify(data));
          JSON.parse(localStorage.getItem('user'));
          this.router.navigate(['/provider/library']);
        }
      })
      .catch(error => this.alertService.danger(error));
  }
}
