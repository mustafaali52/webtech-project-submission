import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BooksService, Category } from '../../shared/services/books.service';

@Component({
  selector: 'app-book-add',
  template: `
    <div class="book-add-container">
      <mat-card class="book-form-card">
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Book' : 'Add New Book' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="bookForm" (ngSubmit)="onSubmit()" class="book-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter book title">
              <mat-error *ngIf="bookForm.get('title')?.invalid && bookForm.get('title')?.touched">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Author</mat-label>
              <input matInput formControlName="author" placeholder="Enter author name">
              <mat-error *ngIf="bookForm.get('author')?.invalid && bookForm.get('author')?.touched">
                Author is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" rows="3" placeholder="Enter book description"></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Price</mat-label>
                <input matInput type="number" formControlName="price" placeholder="0.00">
                <span matPrefix>$</span>
                <mat-error *ngIf="bookForm.get('price')?.invalid && bookForm.get('price')?.touched">
                  Valid price is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Stock Quantity</mat-label>
                <input matInput type="number" formControlName="stockQuantity" placeholder="0">
                <mat-error *ngIf="bookForm.get('stockQuantity')?.invalid && bookForm.get('stockQuantity')?.touched">
                  Stock quantity is required
                </mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Category</mat-label>
              <mat-select formControlName="categoryId">
                <mat-option *ngFor="let category of categories" [value]="category.categoryId">
                  {{ category.categoryName }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="bookForm.get('categoryId')?.invalid && bookForm.get('categoryId')?.touched">
                Category is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Image URL (Optional)</mat-label>
              <input matInput formControlName="imageUrl" placeholder="Enter image URL">
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="bookForm.invalid || isLoading">
                <mat-icon *ngIf="isLoading" class="spinning">refresh</mat-icon>
                <mat-icon *ngIf="!isLoading">{{ isEditMode ? 'update' : 'add' }}</mat-icon>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Book' : 'Add Book') }}
              </button>
              
              <button mat-button type="button" (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .book-add-container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
    }
    .book-form-card {
      padding: 20px;
    }
    .book-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-row {
      display: flex;
      gap: 16px;
    }
    .full-width {
      width: 100%;
    }
    .half-width {
      flex: 1;
    }
    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }
    .spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class BookAddComponent implements OnInit {
  bookForm: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isEditMode = false;
  bookId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    
    // Check if editing
    this.bookId = +this.route.snapshot.params['id'];
    if (this.bookId) {
      this.isEditMode = true;
      this.loadBook();
    }
  }

  loadCategories(): void {
    this.booksService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  loadBook(): void {
    if (this.bookId) {
      this.booksService.getBookById(this.bookId).subscribe({
        next: (book) => {
          this.bookForm.patchValue(book);
        },
        error: (error) => {
          console.error('Error loading book:', error);
          this.snackBar.open('Error loading book details.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid && !this.isLoading) {
      this.isLoading = true;
      const bookData = this.bookForm.value;

      const operation = this.isEditMode 
        ? this.booksService.updateBook(this.bookId!, bookData)
        : this.booksService.createBook(bookData);

      operation.subscribe({
        next: (book) => {
          this.isLoading = false;
          const message = this.isEditMode ? 'Book updated successfully!' : 'Book added successfully!';
          this.snackBar.open(message, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/books']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error saving book:', error);
          let errorMessage = 'Error saving book. Please try again.';
          
          if (error.status === 400) {
            if (error.error?.errors) {
              const errors = Object.values(error.error.errors).flat();
              errorMessage = errors.join(', ');
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
          }
          
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  editBook(book: any): void {
    this.router.navigate(['/admin/books/edit', book.bookId]);
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
}
