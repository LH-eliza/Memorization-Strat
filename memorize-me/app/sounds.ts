export const playCorrectSound = () => {
  const audio = new Audio();
  audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAEAAABhgANTU1NTU1Q0NDQ0NDUFBQUFBQXl5eXl5ea2tra2tra3h4eHh4eIaGhoaGhpOTk5OTk6Gh';
  audio.play().catch(console.error);
};

export const playIncorrectSound = () => {
  const audio = new Audio();
  audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAQQAMzMzM01NTU12dnZ2/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVV';
  audio.play().catch(console.error);
}; 