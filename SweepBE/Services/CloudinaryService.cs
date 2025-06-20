using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

namespace SWEEP.Services
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudName = configuration["Cloudinary:CloudName"];
            var apiKey = configuration["Cloudinary:ApiKey"];
            var apiSecret = configuration["Cloudinary:ApiSecret"];

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
            {
                throw new InvalidOperationException("Cloudinary config missing.");
            }

            var cloudinarySettings = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(cloudinarySettings);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;

            using var stream = file.OpenReadStream();

            var isImage = IsImageFile(file.ContentType);

            if (isImage)
            {
                var imageUploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    UseFilename = true,
                    UniqueFilename = true,
                    AccessMode = "public",
                    Folder = "task_attachments"
                };

                var uploadResult = await _cloudinary.UploadAsync(imageUploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception($"Failed to upload image: {uploadResult.Error.Message}");
                }

                return uploadResult.SecureUrl.ToString();
            }
            else
            {
                //nonImage
                var rawUploadParams = new RawUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    UseFilename = true,
                    UniqueFilename = true,
                    AccessMode = "public",
                    Folder = "task_attachments"
                };

                var uploadResult = await _cloudinary.UploadAsync(rawUploadParams);

                if (uploadResult.Error != null)
                {
                    throw new Exception($"Failed to upload file: {uploadResult.Error.Message}");
                }

                return uploadResult.SecureUrl.ToString();
            }
        }

        private bool IsImageFile(string contentType)
        {
            if (string.IsNullOrEmpty(contentType))
                return false;

            return contentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<byte[]> DownloadFileAsync(string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                    return null;

                using var httpClient = new HttpClient();

                httpClient.DefaultRequestHeaders.Add("User-Agent", "SWEEP-Application/1.0");

                var response = await httpClient.GetAsync(fileUrl);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to download file: {response.StatusCode} - {response.ReasonPhrase}");
                }

                return await response.Content.ReadAsByteArrayAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error downloading file from URL {fileUrl}: {ex.Message}", ex);
            }
        }
    }
}