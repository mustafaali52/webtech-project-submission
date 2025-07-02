using Microsoft.EntityFrameworkCore;
using BookCart.Data;
using BookCart.DTOs;
using BookCart.Models;

namespace BookCart.Services
{
    public class BookService : IBookService
    {
        private readonly BookCartDbContext _context;

        public BookService(BookCartDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BookDto>> GetAllBooksAsync()
        {
            return await _context.Books
                .Include(b => b.Category)
                .Where(b => b.IsActive)
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    Price = b.Price,
                    ImageUrl = b.ImageUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category.CategoryName,
                    StockQuantity = b.StockQuantity,
                    CreatedDate = b.CreatedDate,
                    IsActive = b.IsActive
                })
                .ToListAsync();
        }

        public async Task<BookDto?> GetBookByIdAsync(int id)
        {
            var book = await _context.Books
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.BookId == id && b.IsActive);

            if (book == null) return null;

            return new BookDto
            {
                BookId = book.BookId,
                Title = book.Title,
                Author = book.Author,
                Description = book.Description,
                Price = book.Price,
                ImageUrl = book.ImageUrl,
                CategoryId = book.CategoryId,
                CategoryName = book.Category.CategoryName,
                StockQuantity = book.StockQuantity,
                CreatedDate = book.CreatedDate,
                IsActive = book.IsActive
            };
        }

        public async Task<IEnumerable<BookDto>> GetBooksByCategoryAsync(int categoryId)
        {
            return await _context.Books
                .Include(b => b.Category)
                .Where(b => b.CategoryId == categoryId && b.IsActive)
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    Price = b.Price,
                    ImageUrl = b.ImageUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category.CategoryName,
                    StockQuantity = b.StockQuantity,
                    CreatedDate = b.CreatedDate,
                    IsActive = b.IsActive
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<BookDto>> SearchBooksAsync(string searchTerm)
        {
            return await _context.Books
                .Include(b => b.Category)
                .Where(b => b.IsActive && 
                           (b.Title.Contains(searchTerm) || 
                            b.Author.Contains(searchTerm) || 
                            b.Description!.Contains(searchTerm)))
                .Select(b => new BookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Description = b.Description,
                    Price = b.Price,
                    ImageUrl = b.ImageUrl,
                    CategoryId = b.CategoryId,
                    CategoryName = b.Category.CategoryName,
                    StockQuantity = b.StockQuantity,
                    CreatedDate = b.CreatedDate,
                    IsActive = b.IsActive
                })
                .ToListAsync();
        }

        public async Task<BookDto> CreateBookAsync(CreateBookDto createBookDto)
        {
            var book = new Book
            {
                Title = createBookDto.Title,
                Author = createBookDto.Author,
                Description = createBookDto.Description,
                Price = createBookDto.Price,
                ImageUrl = createBookDto.ImageUrl,
                CategoryId = createBookDto.CategoryId,
                StockQuantity = createBookDto.StockQuantity
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return await GetBookByIdAsync(book.BookId) ?? throw new InvalidOperationException("Failed to create book");
        }

        public async Task<BookDto?> UpdateBookAsync(int id, UpdateBookDto updateBookDto)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return null;

            if (!string.IsNullOrEmpty(updateBookDto.Title))
                book.Title = updateBookDto.Title;
            
            if (!string.IsNullOrEmpty(updateBookDto.Author))
                book.Author = updateBookDto.Author;
            
            if (updateBookDto.Description != null)
                book.Description = updateBookDto.Description;
            
            if (updateBookDto.Price.HasValue)
                book.Price = updateBookDto.Price.Value;
            
            if (updateBookDto.ImageUrl != null)
                book.ImageUrl = updateBookDto.ImageUrl;
            
            if (updateBookDto.CategoryId.HasValue)
                book.CategoryId = updateBookDto.CategoryId.Value;
            
            if (updateBookDto.StockQuantity.HasValue)
                book.StockQuantity = updateBookDto.StockQuantity.Value;
            
            if (updateBookDto.IsActive.HasValue)
                book.IsActive = updateBookDto.IsActive.Value;

            await _context.SaveChangesAsync();
            return await GetBookByIdAsync(id);
        }

        public async Task<bool> DeleteBookAsync(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return false;

            book.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }
    }
}
