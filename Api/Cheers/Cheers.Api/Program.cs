//using Amazon.Extensions.NETCore.Setup;
//using Amazon.S3;
//using Cheers.Api;
//using Cheers.Core;
//using Cheers.Core.IRepository;
//using Cheers.Core.IServices;
//using Cheers.Data;
//using Cheers.Data.Repositories;
//using Cheers.Service.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Builder;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Options;
//using Microsoft.IdentityModel.Tokens;
//using Microsoft.OpenApi.Models;
//using System.Text;
//using DotNetEnv;

//var builder = WebApplication.CreateBuilder(args);
////Env.Load();

//// Add services to the container.
//builder.Services.AddControllers();
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend", policy =>
//    {
//        policy.WithOrigins("http://localhost:5173") // ������ ��� �-URL �� React ���
//              .AllowAnyHeader()
//              .AllowAnyMethod();
//    });
//});

//builder.Services.AddAutoMapper(typeof(MappingProfilePostModel));
//builder.Services.AddAutoMapper(typeof(MapperProfile), typeof(MappingProfilePostModel));



////todo
//// ���� �� �-connection string �������������
////string connectionString = builder.Configuration["ConnectionStrings:DefaultConnection"];

////// ����� �-DataContext
////builder.Services.AddDbContext<DataContext>(options =>
////    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


//builder.Services.AddDbContext<DataContext>();


//// ����� �-repositories
//builder.Services.AddScoped<IRepositoryCandidate, RepositortCandidate>();
//builder.Services.AddScoped<IRepositoryUser, RepositoryUsers>();
//builder.Services.AddScoped<IRoleRepository, RoleRepository>();
//builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();

//// ����� ��������
//builder.Services.AddScoped<IServiceCandidate, CandidateService>();

//builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
//builder.Services.AddScoped<IAuthService, AuthService>();

//builder.Services.AddScoped<IServiceUser, UserService>();
//builder.Services.AddScoped<IUserRoleService, UserRoleService>();
//builder.Services.AddScoped<IUploadService, UploadService>();
////builder.Services.AddScoped<IIdVerificationService, IdVerificationService>();

//// ��� �� ���� �-.env
//builder.Configuration.AddEnvironmentVariables();

//// ���� �� �������
//var awsAccessKey = builder.Configuration["AWS:AccessKey"];
//var awsSecretKey = builder.Configuration["AWS:SecretKey"];
//var awsRegion = builder.Configuration["AWS:Region"];

//// ����� ������� ��� �����
//builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
//{
//    var credentials = new Amazon.Runtime.BasicAWSCredentials(awsAccessKey, awsSecretKey);
//    var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

//    return new AmazonS3Client(credentials, region);
//});

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.Authority = "https://accounts.google.com";
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidIssuer = "https://accounts.google.com",
//        ValidateAudience = true,
//        ValidAudience = "300837799563-knrc4dqeie5osqif56d6ofpg8tr93bc7.apps.googleusercontent.com�",
//        ValidateLifetime = true
//    };
//});




//// ����� ������ �������-�������
//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
//    options.AddPolicy("MatchmakerOrAdmin", policy => policy.RequireRole("Matchmaker", "Admin"));
//    options.AddPolicy("CandidateOrMatchmaker", policy => policy.RequireRole("Candidate", "Matchmaker"));
//    options.AddPolicy("WomenOrMatchmaker", policy => policy.RequireRole("Women", "Matchmaker"));
//});

//// ����� Swagger
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cheers API", Version = "v1" });
//});

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//    app.UseSwagger();
//    app.UseSwaggerUI(c =>
//    {
//        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cheers API V1");
//        c.RoutePrefix = string.Empty;
//    });
//}

//// Configure the HTTP request pipeline.
//app.UseHttpsRedirection();
//app.UseCors("AllowFrontend");
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();
//app.Run();



using Amazon.Extensions.NETCore.Setup;
using Amazon.S3;
using Cheers.Api;
using Cheers.Core;
using Cheers.Core.IRepository;
using Cheers.Core.IServices;
using Cheers.Data;
using Cheers.Data.Repositories;
using Cheers.Service.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// ?? ��� �� ���� �-.env ���� ���!


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:4200") // ������ ��� �-URL �� React ���
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddAutoMapper(typeof(MappingProfilePostModel));
builder.Services.AddAutoMapper(typeof(MapperProfile), typeof(MappingProfilePostModel));
Env.Load();


//todo
// ���� �� �-connection string ������������� �� �-.env
// string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ?? 
//                          builder.Configuration["ConnectionStrings:DefaultConnection"];

//// ����� �-DataContext
//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddDbContext<DataContext>();

// ����� �-repositories
builder.Services.AddScoped<IRepositoryCandidate, RepositortCandidate>();
builder.Services.AddScoped<IRepositoryUser, RepositoryUsers>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();

// ����� ��������
builder.Services.AddScoped<IServiceCandidate, CandidateService>();

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddScoped<IServiceUser, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUploadService, UploadService>();
//builder.Services.AddScoped<IIdVerificationService, IdVerificationService>();

// ?? ���� �� ������� �-.env ����� ���������
var awsAccessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
var awsSecretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");

// ����� ������ �������
if (string.IsNullOrEmpty(awsAccessKey) || string.IsNullOrEmpty(awsSecretKey) || string.IsNullOrEmpty(awsRegion))
{
    throw new InvalidOperationException("? AWS credentials �� ����� ����� .env! ���� ������ ���� ��� �� AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION");
}

Console.WriteLine("? AWS credentials ����� ������ ����� .env");
Console.WriteLine($"?? AWS Region: {awsRegion}");
Console.WriteLine($"?? AWS Access Key: {awsAccessKey[..4]}***"); // ���� �� 4 ����� �������

// ����� ������� ��� �����
builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    var credentials = new Amazon.Runtime.BasicAWSCredentials(awsAccessKey, awsSecretKey);
    var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);

    return new AmazonS3Client(credentials, region);
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = "https://accounts.google.com";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = "https://accounts.google.com",
        ValidateAudience = true,
        ValidAudience = "300837799563-knrc4dqeie5osqif56d6ofpg8tr93bc7.apps.googleusercontent.com", // ������ �� ����� ����
        ValidateLifetime = true
    };
});

// ����� ������ �������-�������
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MatchmakerOrAdmin", policy => policy.RequireRole("Matchmaker", "Admin"));
    options.AddPolicy("CandidateOrMatchmaker", policy => policy.RequireRole("Candidate", "Matchmaker"));
    options.AddPolicy("WomenOrMatchmaker", policy => policy.RequireRole("Women", "Matchmaker"));
});

// ����� Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cheers API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cheers API V1");
        c.RoutePrefix = string.Empty;
    });
}
app.UseStaticFiles();


// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();