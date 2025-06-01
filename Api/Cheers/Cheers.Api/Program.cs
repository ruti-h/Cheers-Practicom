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
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// ��� �� ���� �-.env ���� ���!
Env.Load();

// Add services to the container.
builder.Services.AddControllers();

// ����� CORS - �����
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ������ AllowCredentials
    });
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfilePostModel));
builder.Services.AddAutoMapper(typeof(MapperProfile), typeof(MappingProfilePostModel));

// Connection String
string connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ??
                          builder.Configuration["ConnectionStrings:DefaultConnection"];

// ����� �-DataContext - ���� (����� ������)
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));
//string baseConnectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING") ??
//                              builder.Configuration["ConnectionStrings:DefaultConnection"];

//// ��� �� - ����� database (�� dataBase):
//string connectionString = $"{baseConnectionString};Pooling=true;MaximumPoolSize=2;ConnectionTimeout=30;CommandTimeout=60;";

//// ����� DbContext
//builder.Services.AddDbContext<DataContext>(options =>
//    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), mySqlOptions =>
//    {
//        mySqlOptions.EnableRetryOnFailure(
//            maxRetryCount: 3,
//            maxRetryDelay: TimeSpan.FromSeconds(5),
//            errorNumbersToAdd: null);
//    }), ServiceLifetime.Scoped);
// ����� �-repositories
builder.Services.AddScoped<IRepositoryCandidate, RepositortCandidate>();
builder.Services.AddScoped<IRepositoryUser, RepositoryUsers>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<GptService>();

// ����� ��������
builder.Services.AddScoped<IServiceCandidate, CandidateService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IServiceUser, UserService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IUploadService, UploadService>();

// AWS Configuration
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());

var awsAccessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY");
var awsSecretKey = Environment.GetEnvironmentVariable("AWS_SECRET_KEY");
var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION");

// ����� ������ �������
if (string.IsNullOrEmpty(awsAccessKey) || string.IsNullOrEmpty(awsSecretKey) || string.IsNullOrEmpty(awsRegion))
{
    throw new InvalidOperationException("AWS credentials �� ����� ����� .env! ���� ������ ���� ��� �� AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION");
}

// AWS S3 Client
builder.Services.AddSingleton<IAmazonS3>(serviceProvider =>
{
    var credentials = new Amazon.Runtime.BasicAWSCredentials(awsAccessKey, awsSecretKey);
    var region = Amazon.RegionEndpoint.GetBySystemName(awsRegion);
    return new AmazonS3Client(credentials, region);
});

// JWT Configuration - ����� ������ ����� Google OAuth
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ??
                builder.Configuration["JwtSettings:Secret"] ??
                "your-super-secret-key-for-jwt-tokens-minimum-32-chars-long";

var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ??
                builder.Configuration["JwtSettings:Issuer"] ??
                "https://localhost:7215";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtIssuer,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
    };
});

// ����� ������ �������-�������
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("MatchmakerOrAdmin", policy => policy.RequireRole("Matchmaker", "Admin"));
    options.AddPolicy("CandidateOrMatchmaker", policy => policy.RequireRole("Candidate", "Matchmaker"));
});

// ����� Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cheers API", Version = "v1" });

    // ����� JWT �Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
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
app.UseHttpsRedirection();

// ��� ����! CORS ���� Authentication
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();