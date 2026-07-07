import { LucideIcon } from "lucide-react";
import Card from "./Card";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card>

      <Icon
        size={34}
        className="text-orange-500 mb-4"
      />

      <h3 className="text-xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>

    </Card>
  );
}