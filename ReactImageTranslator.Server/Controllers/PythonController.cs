using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Diagnostics;
using System.Threading.Tasks;

namespace ReactImageTranslator.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PythonController : Controller
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        //private readonly IHubContext<OutputHub> _hubContext;
        string consoleOutput = "";

        public PythonController(IWebHostEnvironment webHostEnvironment) //, IHubContext<OutputHub> hubContext
        {
            _webHostEnvironment = webHostEnvironment;
            //_hubContext = hubContext;
        }

        [HttpGet]
        [Route("translate")]
        public async Task<IActionResult> GetVersion()
        {
            var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath ?? _webHostEnvironment.ContentRootPath, "Uploads");
            ProcessStartInfo py = new ProcessStartInfo
            {
                FileName = "../opt/venv/bin/python3",
                Arguments = "./PythonImageTranslation/manga_translator.py " + uploadsFolder,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                WorkingDirectory = "/app"
            };

            int exitCode = -1;

            try
            {
                using (Process p = Process.Start(py))
                {
                    p.OutputDataReceived += Process_OutputDataReceived;
                    p.ErrorDataReceived += Process_OutputDataReceived;

                    await p.WaitForExitAsync();

                    exitCode = p.ExitCode;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            

            return Ok("exit: " + exitCode + " || " + consoleOutput);
        }

        void Process_OutputDataReceived(object sender, DataReceivedEventArgs e)
        {
            consoleOutput += "\n" + e.Data; // add to output textbox
            //_hubContext.Clients.All.SendAsync("ReceiveOutput", e.Data);
        }


        [HttpGet]
        [Route("getimages")]
        public IActionResult GetImages()
        {
            string[] imageExtensions = { ".jpg", ".jpeg", ".png" };

            var imageFolderPath = Path.Combine(_webHostEnvironment.WebRootPath ?? _webHostEnvironment.ContentRootPath, "Uploads", "translated");
            
            if (!Directory.Exists(imageFolderPath))
            {
                return NotFound("Image folder not found.");
            }

            var imageFiles = Directory.GetFiles(imageFolderPath)
                .Where(file => imageExtensions.Contains(Path.GetExtension(file).ToLower()))
                .Select(filePath => Path.GetFileName(filePath))
                .ToList();

            // Construct full URLs for the images
            var imageUrls = imageFiles.Select(fileName =>
            {
                return $"{Request.Scheme}://{Request.Host}/Uploads/translated/{fileName}";
            }).ToList();

            return Ok(imageUrls);
        }
    }

    //public class OutputHub : Hub { }
}
