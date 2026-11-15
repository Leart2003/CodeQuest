using CodeQuest.Domain.Entities;
using CodeQuest.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace CodeQuest.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Worlds.AnyAsync())
            return;

        var worlds = new List<World>
        {
            new World
            {
                Title = "C# Basics",
                Description = "Variables, types and your first programs.",
                Order = 1,
                Levels = new List<Level>
                {
                    new Level
                    {
                        Title = "Simple math",
                        Question = "What does this code print?",
                        CodeSnippet = "Console.WriteLine(5 + 3);",
                        ChallengeType = ChallengeType.MultipleChoice,
                        XpReward = 10,
                        Order = 1,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "8", IsCorrect = true },
                            new LevelOption { Text = "53" },
                            new LevelOption { Text = "5 + 3" },
                            new LevelOption { Text = "Error" }
                        }
                    },
                    new Level
                    {
                        Title = "Declare an integer",
                        Question = "Fill in the missing type.",
                        CodeSnippet = "___ age = 20;",
                        ChallengeType = ChallengeType.FillInTheBlank,
                        XpReward = 10,
                        Order = 2,
                        Answers = new List<LevelAnswer>
                        {
                            new LevelAnswer { AcceptedAnswer = "int" }
                        }
                    },
                    new Level
                    {
                        Title = "Wrong type",
                        Question = "Which line has a bug?",
                        ChallengeType = ChallengeType.SpotTheBug,
                        XpReward = 15,
                        Order = 3,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "string name = \"Arta\";" },
                            new LevelOption { Text = "int age = \"twenty\";", IsCorrect = true },
                            new LevelOption { Text = "Console.WriteLine(name + age);" }
                        }
                    },
                    new Level
                    {
                        Title = "Put it in order",
                        Question = "Arrange the lines so the program prints 55.",
                        ChallengeType = ChallengeType.OrderTheLines,
                        XpReward = 20,
                        Order = 4,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "int price = 20;", CorrectPosition = 1 },
                            new LevelOption { Text = "int total = price * 3;", CorrectPosition = 2 },
                            new LevelOption { Text = "total = total - 5;", CorrectPosition = 3 },
                            new LevelOption { Text = "Console.WriteLine(total);", CorrectPosition = 4 }
                        }
                    }
                }
            },
            new World
            {
                Title = "Control Flow",
                Description = "Loops and conditions.",
                Order = 2,
                Levels = new List<Level>
                {
                    new Level
                    {
                        Title = "The for loop",
                        Question = "What does this code print?",
                        CodeSnippet = """
                            for (int i = 0; i < 3; i++)
                            {
                                Console.Write(i);
                            }
                            """,
                        ChallengeType = ChallengeType.MultipleChoice,
                        XpReward = 10,
                        Order = 1,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "012", IsCorrect = true },
                            new LevelOption { Text = "123" },
                            new LevelOption { Text = "0123" },
                            new LevelOption { Text = "Nothing" }
                        }
                    },
                    new Level
                    {
                        Title = "The other branch",
                        Question = "Fill in the missing keyword.",
                        CodeSnippet = """
                            int x = 10;
                            if (x > 5)
                                Console.WriteLine("Big");
                            ___
                                Console.WriteLine("Small");
                            """,
                        ChallengeType = ChallengeType.FillInTheBlank,
                        XpReward = 10,
                        Order = 2,
                        Answers = new List<LevelAnswer>
                        {
                            new LevelAnswer { AcceptedAnswer = "else" }
                        }
                    },
                    new Level
                    {
                        Title = "Assignment or comparison?",
                        Question = "Which line has a bug?",
                        ChallengeType = ChallengeType.SpotTheBug,
                        XpReward = 15,
                        Order = 3,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "int score = 50;" },
                            new LevelOption { Text = "if (score = 50)", IsCorrect = true },
                            new LevelOption { Text = "Console.WriteLine(\"Half\");" }
                        }
                    }
                }
            },
            new World
            {
                Title = "Collections and LINQ",
                Description = "Lists, foreach and simple LINQ queries.",
                Order = 3,
                Levels = new List<Level>
                {
                    new Level
                    {
                        Title = "Filtering with Where",
                        Question = "What does result contain?",
                        CodeSnippet = """
                            var numbers = new List<int> { 1, 2, 3, 4 };
                            var result = numbers.Where(x => x > 2);
                            """,
                        ChallengeType = ChallengeType.MultipleChoice,
                        XpReward = 15,
                        Order = 1,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "3 and 4", IsCorrect = true },
                            new LevelOption { Text = "1 and 2" },
                            new LevelOption { Text = "Only 3" },
                            new LevelOption { Text = "true or false" }
                        }
                    },
                    new Level
                    {
                        Title = "Transforming with Select",
                        Question = "Fill in the method name that doubles every number.",
                        CodeSnippet = "var doubled = numbers.___(x => x * 2);",
                        ChallengeType = ChallengeType.FillInTheBlank,
                        XpReward = 15,
                        Order = 2,
                        Answers = new List<LevelAnswer>
                        {
                            new LevelAnswer { AcceptedAnswer = "Select" }
                        }
                    },
                    new Level
                    {
                        Title = "Loop over a list",
                        Question = "Arrange the lines so the program prints every name.",
                        ChallengeType = ChallengeType.OrderTheLines,
                        XpReward = 20,
                        Order = 3,
                        Options = new List<LevelOption>
                        {
                            new LevelOption { Text = "var names = new List<string> { \"Ana\", \"Besa\" };", CorrectPosition = 1 },
                            new LevelOption { Text = "foreach (var name in names)", CorrectPosition = 2 },
                            new LevelOption { Text = "{", CorrectPosition = 3 },
                            new LevelOption { Text = "Console.WriteLine(name);", CorrectPosition = 4 },
                            new LevelOption { Text = "}", CorrectPosition = 5 }
                        }
                    }
                }
            }
        };

        context.Worlds.AddRange(worlds);
        await context.SaveChangesAsync();
    }
}