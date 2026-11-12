using System;
using System.Collections.Generic;
using System.Text;

namespace CodeQuest.Domain.Entities
{
    public class World
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Order { get; set; }

        public List<Level> Levels { get; set; } = new();
    }
}
