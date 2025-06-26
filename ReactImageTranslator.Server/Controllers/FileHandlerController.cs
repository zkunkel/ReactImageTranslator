using Microsoft.AspNetCore.Mvc;

namespace ReactImageTranslator.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileHandlerController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileHandlerController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }


        [HttpPost]
        [Route("UploadFiles")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFiles([FromForm(Name = "files")] List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
                return BadRequest("No files uploaded.");


            var uploadedFiles = new List<string>();

            try
            {
                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath ?? _webHostEnvironment.ContentRootPath, "Uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var file in files)
                {
                    var filePath = Path.Combine(uploadsFolder, Path.GetFileName(file.FileName));
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    uploadedFiles.Add(file.FileName);
                }
            }
            catch (Exception ex)
            {

            }
            

            return Ok(new { uploadedFiles });
        }
    }
}
