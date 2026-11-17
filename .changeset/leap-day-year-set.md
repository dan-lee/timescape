---
"timescape": patch
---

Fix leap day and day clamping edge cases:

- Typing (or blurring a partial) non-leap year on Feb 29 now clamps to Feb 28 instead of rolling over to Mar 1
- The day the user picked is remembered across month/year changes, so a leap day or 31st can be typed before the month/year (e.g. `29.02.2024` in a day-first layout), and stepping through a shorter month restores the day once it fits again (Jan 31 → Feb 29 → Mar 31)
- Feb 29 is no longer rejected in year 0000
