using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;

[Route("api/files")]
[ApiController]
public class FilesController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    public FilesController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFileAsync(IFormFile file, string bucketName, string? prefix)
    {
        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
        var request = new PutObjectRequest()
        {
            BucketName = bucketName,
            Key = string.IsNullOrEmpty(prefix) ? file.FileName : $"{prefix?.TrimEnd('/')}/{file.FileName}",
            InputStream = file.OpenReadStream()
        };
        request.Metadata.Add("Content-Type", file.ContentType);
        await _s3Client.PutObjectAsync(request);
        return Ok($"File {prefix}/{file.FileName} uploaded to S3 successfully!");
    }
}
