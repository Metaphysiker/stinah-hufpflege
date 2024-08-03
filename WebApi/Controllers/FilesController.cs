using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Authorize]
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
    public async Task<IActionResult> UploadFileAsync(IFormFile file)
    {

        long timeNow = DateTimeOffset.Now.ToUnixTimeSeconds();
        string timeStamp = timeNow.ToString();
        //var prefix = Guid.NewGuid().ToString();
        var prefix = timeStamp;
        var bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
        var request = new PutObjectRequest()
        {
            BucketName = bucketName,
            Key = string.IsNullOrEmpty(prefix) ? file.FileName : $"{prefix?.TrimEnd('/')}-{file.FileName}",
            InputStream = file.OpenReadStream()
        };
        request.Metadata.Add("Content-Type", file.ContentType);
        await _s3Client.PutObjectAsync(request);
        return Ok($"{prefix}-{file.FileName}");
    }

    [HttpGet("get-all")]
    public async Task<IActionResult> GetAllFilesAsync(string? prefix)
    {
        var bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");

        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");
        var request = new ListObjectsV2Request()
        {
            BucketName = bucketName,
            Prefix = prefix
        };
        var result = await _s3Client.ListObjectsV2Async(request);
        var s3Objects = result.S3Objects.Select(s =>
        {
            var urlRequest = new GetPreSignedUrlRequest()
            {
                BucketName = bucketName,
                Key = s.Key,
                Expires = DateTime.UtcNow.AddMinutes(1)
            };
            return new S3ObjectDto()
            {
                Name = s.Key.ToString(),
                PresignedUrl = _s3Client.GetPreSignedURL(urlRequest),
            };
        });
        return Ok(s3Objects);
    }

    [HttpGet("get-by-key")]
    public async Task<IActionResult> GetFileByKeyAsync(string key)
    {
        var bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");

        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");

        var s3Object = await _s3Client.GetObjectAsync(bucketName, key);
        return File(s3Object.ResponseStream, s3Object.Headers.ContentType);
    }

    [HttpGet("get-presigned-url-by-key")]
    public async Task<IActionResult> GetPresignedUrlByKeyAsync(string key)
    {
        var bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");

        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist.");

        var urlRequest = new GetPreSignedUrlRequest()
        {
            BucketName = bucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddMinutes(5)
        };

        return Ok(_s3Client.GetPreSignedURL(urlRequest));
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteFileAsync(string key)
    {
        var bucketName = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");

        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client: _s3Client, bucketName: bucketName);
        if (!bucketExists) return NotFound($"Bucket {bucketName} does not exist");
        await _s3Client.DeleteObjectAsync(bucketName, key);
        return NoContent();
    }
}
