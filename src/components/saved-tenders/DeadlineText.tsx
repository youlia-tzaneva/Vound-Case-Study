interface DeadlineTextProps {
  deadline: string;
}

export function DeadlineText({ deadline }: DeadlineTextProps) {
  const [date, time] = deadline.split(" | ");

  return (
    <div className="flex flex-col gap-4xs">
      <span className="whitespace-nowrap text-table text-text-primary">{date}</span>
      {time ? (
        <span className="whitespace-nowrap text-table text-text-secondary">{time}</span>
      ) : null}
    </div>
  );
}
