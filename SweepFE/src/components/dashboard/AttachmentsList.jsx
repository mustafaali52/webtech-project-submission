import React, { useState } from 'react';
import taskAPI from '../../services/taskAPI';
import { 
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  TableCellsIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const AttachmentsList = ({ attachments, showTitle = true, className = "" }) => {
  const [downloading, setDownloading] = useState(null);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileIcon = (fileType) => {
    const lowerType = fileType?.toLowerCase() || '';
    
    if (lowerType.includes('pdf')) {
      return <DocumentTextIcon className="h-5 w-5 text-red-600" />;
    }
    if (lowerType.includes('doc') || lowerType.includes('docx')) {
      return <DocumentIcon className="h-5 w-5 text-blue-600" />;
    }
    if (lowerType.includes('xls') || lowerType.includes('xlsx')) {
      return <TableCellsIcon className="h-5 w-5 text-green-600" />;
    }
    if (lowerType.includes('ppt') || lowerType.includes('pptx')) {
      return <PresentationChartBarIcon className="h-5 w-5 text-orange-600" />;
    }
    if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('png') || lowerType.includes('gif')) {
      return <PhotoIcon className="h-5 w-5 text-purple-600" />;
    }
    
    return <DocumentIcon className="h-5 w-5 text-gray-600" />;
  };

  const getFileColor = (fileType) => {
    const lowerType = fileType?.toLowerCase() || '';
    
    if (lowerType.includes('pdf')) return 'border-red-200 bg-red-50 hover:bg-red-100';
    if (lowerType.includes('doc') || lowerType.includes('docx')) return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    if (lowerType.includes('xls') || lowerType.includes('xlsx')) return 'border-green-200 bg-green-50 hover:bg-green-100';
    if (lowerType.includes('ppt') || lowerType.includes('pptx')) return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
    if (lowerType.includes('image') || lowerType.includes('jpg') || lowerType.includes('jpeg') || lowerType.includes('png') || lowerType.includes('gif')) {
      return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
    }
    
    return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) return '';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = sizeInBytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };  const handleDownload = async (attachment) => {
    const attachmentId = attachment.attachmentId;
    setDownloading(attachmentId);
    
    const fileName = attachment.fileName;
    
    if (!attachmentId || !fileName) {
      console.error('Missing attachment ID or fileName:', attachment);
      setDownloading(null);
      return;
    }
    
    try {
      await taskAPI.downloadAttachment(attachmentId, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      
      //direct download url
      const fileUrl = attachment.fileUrl;
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Sorry, the file could not be downloaded. Please try again later.');
      }
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className={className}>
      {showTitle && (
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
          <div className="w-1 h-6 bg-indigo-500 rounded-full mr-3"></div>
          Attachments ({attachments.length})
        </h4>
      )}
      
      <div className="space-y-2">        
        {attachments.map((attachment, index) => (
          <div
            key={attachment.attachmentId || index}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors cursor-pointer ${getFileColor(attachment.fileType)}`}
            onClick={() => handleDownload(attachment)}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {getFileIcon(attachment.fileType)}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachment.fileName || 'Unknown file'}
                </p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{attachment.fileType || 'Unknown type'}</span>
                  {attachment.fileSize && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(attachment.fileSize)}</span>
                    </>
                  )}
                  {attachment.uploadedAt && (
                    <>
                      <span>•</span>
                      <span>
                        {new Date(attachment.uploadedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(attachment);
              }}
              disabled={downloading === attachment.attachmentId}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              title="Download file"
            >
              {downloading === attachment.attachmentId ? (
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
              ) : (
                <ArrowDownTrayIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentsList;
