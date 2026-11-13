using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace CodeQuest.Application.DTOs.Auth
{
    public class RegisterDto
    {
        [Required, MinLength(3), MaxLength(30)]
        public string Username { get; set; } = string.Empty;

        [Required, MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
