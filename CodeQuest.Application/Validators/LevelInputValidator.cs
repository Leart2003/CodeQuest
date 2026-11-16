using CodeQuest.Application.DTOs.Admin;
using CodeQuest.Domain.Enums;

namespace CodeQuest.Application.Validators;

public static class LevelInputValidator
{
    public static List<string> Validate(LevelInputDto dto)
    {
        var errors = new List<string>();

        switch (dto.ChallengeType)
        {
            case ChallengeType.MultipleChoice:
            case ChallengeType.SpotTheBug:
                if (dto.Options.Count < 2)
                    errors.Add("At least 2 options are required.");
                if (dto.Options.Count(o => o.IsCorrect) != 1)
                    errors.Add("Exactly one option must be marked as correct.");
                break;

            case ChallengeType.FillInTheBlank:
                if (!dto.Answers.Any(a => !string.IsNullOrWhiteSpace(a)))
                    errors.Add("At least one accepted answer is required.");
                if (string.IsNullOrWhiteSpace(dto.CodeSnippet) || !dto.CodeSnippet.Contains("___"))
                    errors.Add("The code snippet must contain ___ where the blank goes.");
                break;

            case ChallengeType.OrderTheLines:
                if (dto.Options.Count < 2)
                    errors.Add("At least 2 lines are required.");

                var positions = dto.Options.Select(o => o.CorrectPosition).OrderBy(p => p).ToList();
                var expected = Enumerable.Range(1, dto.Options.Count).Select(i => (int?)i).ToList();
                if (!positions.SequenceEqual(expected))
                    errors.Add("CorrectPosition must be 1, 2, 3... with no gaps or duplicates.");
                break;
        }

        if (dto.ChallengeType != ChallengeType.FillInTheBlank &&
            dto.Options.Any(o => string.IsNullOrWhiteSpace(o.Text)))
        {
            errors.Add("Every option needs text.");
        }

        return errors;
    }
}