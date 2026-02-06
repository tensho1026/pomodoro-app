import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatCard = {
  title: string;
  value: string;
  description: string;
};

type StatsCardsProps = {
  cards: StatCard[];
};

export function StatsCards({ cards }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tracking-tight">{card.value}</p>
            <p className="mt-1 text-xs text-muted">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
