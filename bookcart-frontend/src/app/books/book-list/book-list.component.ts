import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { BooksService, Book, Category } from '../../shared/services/books.service';
import { CartService } from '../../shared/services/cart.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: Category[] = [];
  filteredBooks: Book[] = [];
  isLoading = true;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  sortBy = 'title';
  sortDirection = 'asc';
  
  private destroy$ = new Subject<void>();

  constructor(
    private booksService: BooksService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();
    
    // Listen to query parameters for search
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['search']) {
          this.searchTerm = params['search'];
          this.searchBooks();
        } else if (params['category']) {
          this.selectedCategoryId = +params['category'];
          this.filterByCategory();
        } else {
          this.loadBooks();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.booksService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.filteredBooks = [...books];
        this.applySorting();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.snackBar.open('Error loading books. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      }
    });
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

  searchBooks(): void {
    if (this.searchTerm.trim()) {
      this.isLoading = true;
      this.booksService.searchBooks(this.searchTerm.trim()).subscribe({
        next: (books) => {
          this.filteredBooks = books;
          this.applySorting();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching books:', error);
          this.snackBar.open('Error searching books. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    } else {
      this.filteredBooks = [...this.books];
      this.applySorting();
    }
  }

  filterByCategory(): void {
    if (this.selectedCategoryId) {
      this.isLoading = true;
      this.booksService.getBooksByCategory(this.selectedCategoryId).subscribe({
        next: (books) => {
          this.filteredBooks = books;
          this.applySorting();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error filtering books by category:', error);
          this.snackBar.open('Error filtering books. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          this.isLoading = false;
        }
      });
    } else {
      this.filteredBooks = [...this.books];
      this.applySorting();
    }
  }

  onCategoryChange(): void {
    if (this.selectedCategoryId) {
      this.router.navigate(['/books'], { 
        queryParams: { category: this.selectedCategoryId } 
      });
    } else {
      this.router.navigate(['/books']);
    }
  }

  onSortChange(): void {
    this.applySorting();
  }

  applySorting(): void {
    this.filteredBooks.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof Book];
      let bValue: any = b[this.sortBy as keyof Book];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (this.sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  addToCart(book: Book): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/books' } 
      });
      return;
    }

    const request = {
      bookId: book.bookId,
      quantity: 1
    };

    this.cartService.addToCart(request).subscribe({
      next: () => {
        this.snackBar.open(`"${book.title}" added to cart!`, 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.snackBar.open('Error adding to cart. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  editBook(book: Book): void {
    this.router.navigate(['/admin/books/edit', book.bookId]);
  }

  deleteBook(book: Book): void {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.booksService.deleteBook(book.bookId).subscribe({
        next: () => {
          this.snackBar.open(`"${book.title}" deleted successfully!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadBooks();
        },
        error: (error) => {
          console.error('Error deleting book:', error);
          this.snackBar.open('Error deleting book. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.router.navigate(['/books']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/book-placeholder.jpg';
  }
}
