import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // ✅ Import Router

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent {
  selectedFile: File | null = null;
  employeeId: number | null = null;
  userId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {} // ✅ Inject Router

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile() {
    if (!this.selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('File', this.selectedFile);

    if (this.employeeId != null) formData.append('EmployeeId', this.employeeId.toString());
    if (this.userId != null) formData.append('UserId', this.userId.toString());

    this.http.post('https://localhost:7151/api/FileUpload/upload', formData).subscribe({
      next: (res) => {
        alert('✅ File uploaded successfully!');
        console.log(res);

        // ✅ Redirect to dashboard after short delay
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500); // 1.5 second delay
      },
      error: (err) => {
        alert('❌ Failed to upload file.');
        console.error(err);
      }
    });
  }
}
