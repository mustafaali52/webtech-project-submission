using System.Text.Json.Serialization;

namespace SWEEP.DTOs.ResponseDTOs.Task
{
    public class TaskAttachmentDTO
    {
        [JsonPropertyName("attachmentId")]
        public int AttachmentId { get; set; }
        
        [JsonPropertyName("fileUrl")]
        public string FileUrl { get; set; } = string.Empty;
        
        [JsonPropertyName("fileName")]
        public string FileName { get; set; } = string.Empty;
        
        [JsonPropertyName("fileType")]
        public string FileType { get; set; } = string.Empty;
        
        [JsonPropertyName("uploadedAt")]
        public DateTime UploadedAt { get; set; }
    }
}