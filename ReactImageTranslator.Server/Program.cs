
using Microsoft.Net.Http.Headers;
using ReactImageTranslator.Server.Controllers;
using System;

namespace ReactImageTranslator.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("PolicyApi", policy =>
                {
                    policy.WithOrigins("https://localhost:3161",
                        "http://localhost:3161",
                        "https://localhost:44307",
                        "http://localhost:44307"
                        )
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
                    //.WithMethods("POST", "GET", "PUT", "DELETE")
                    //.WithHeaders(HeaderNames.ContentType);
                });
            });
            builder.Services.AddSignalR();

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            
            //builder.Services.AddHostedService<PythonOutputHub>();


            var app = builder.Build();

            app.UseDefaultFiles();
            app.MapStaticAssets();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            
            app.UseCors("PolicyApi");

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllers();

            app.MapHub<PythonOutputHub>("/recvPython");


            app.MapFallbackToFile("/index.html");
            

            //app.UseDeveloperExceptionPage();

            //spa.UseProxyToSpaDevelopmentServer("http://localhost:3161");

            app.Run();
        }
    }
}
