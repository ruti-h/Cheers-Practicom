
using Cheers.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Text.RegularExpressions;

namespace Cheers.Data
{
  public  class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<Candidate> Candidates { get; set; }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Permission> Permissions { get; set; }
        public DbSet<RolePermission> RolePermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        

            base.OnModelCreating(modelBuilder);
            //todo add foreign key to familyDetail
            // הגדרת ירושה של User
            //modelBuilder.Entity<Candidate>()
            //    .HasDiscriminator<string>("UserType")
            //    .HasValue<Candidate>("User")
            //    .HasValue<Candidate>("Candidate")
            //    .HasValue<Candidate>("Candidate")
               
            //  ;

         
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    base.OnConfiguring(optionsBuilder);
        //    optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=DB-Of-MatchMakings");
        //}
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {


            //Services.AddDbContext<DataContext>(options =>
            //    //    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString), options => options.CommandTimeout(60)));
            //    //builder.Services.AddDbContext<DataContext>();
            optionsBuilder.UseMySql("server=bh4kgdpp7ashegjmyrdh-mysql.services.clever-cloud.com;user=uchoigwrojndnpgk;password=RTuYaesqGhRliAMKStXZ;dataBase=bh4kgdpp7ashegjmyrdh;", ServerVersion.AutoDetect("server=bh4kgdpp7ashegjmyrdh-mysql.services.clever-cloud.com;user=uchoigwrojndnpgk;password=RTuYaesqGhRliAMKStXZ;dataBase=bh4kgdpp7ashegjmyrdh;"));
            string connectionString = "server=bh4kgdpp7ashegjmyrdh-mysql.services.clever-cloud.com;user=uchoigwrojndnpgk;password=RTuYaesqGhRliAMKStXZ;dataBase=bh4kgdpp7ashegjmyrdh;";

            //    // רישום ה-DataContext
            //    optionsBuilder.Services.AddDbContext<DataContext>(options =>
            //    // Update the MySQL configuration to include the required ServerVersion parameter
            //    builder.Services.AddDbContext<DataContext>(options =>
            //        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString))));

        }


        //{
        //    optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=DB-Of-MatchMakings");
        //}
    }
}
