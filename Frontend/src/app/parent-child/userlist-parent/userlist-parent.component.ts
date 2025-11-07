import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { UsercardChildComponent } from '../usercard-child/usercard-child.component';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../services/auth.service';

@Component({
  selector: 'app-userlist-parent',
   standalone: true,
  imports: [CommonModule, UsercardChildComponent],  
  templateUrl: './userlist-parent.component.html',
  styleUrl: './userlist-parent.component.css'
})
export class UserlistParentComponent {

 private userService = inject(UserService);
  private router = inject(Router);


  // Signals
  users = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  
   ngOnInit() {
    this.loadUsers();
  }


    loadUsers() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    // this.userService.getAllUsers().subscribe({
    //   next: (users) => {
    //     this.users.set(users);
    //     this.isLoading.set(false);
    //   },
    //   error: (error) => {
    //     this.errorMessage.set(error.message);
    //     this.isLoading.set(false);
    //   }
    // });
  }



   // ✅ Handle events FROM child components
  onUserClicked(user: User) {
    console.log('User clicked:', user);
    this.selectedUser.set(user);
  }



    onUserDeleted(userId: number) {
    console.log('Delete user:', userId);
    if (confirm('Are you sure you want to delete this user?')) {
      // Call delete API here
      const updatedUsers = this.users().filter(u => u.userId !== userId);
      this.users.set(updatedUsers);
    }
  }

  onUserEdited(user: User) {
    console.log('Edit user:', user);
    this.router.navigate(['/admin/users/edit', user.userId]);
  }

  addNewUser() {
    this.router.navigate(['/admin/users/create']);
  }

}
