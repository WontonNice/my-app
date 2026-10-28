import { Utensils } from 'lucide-react';

export function MealPhoto({ image, name }: { image?: string; name: string }) {
  return image ? <img src={image} alt={name} loading="lazy" /> : <div className="meal-photo-empty"><Utensils size={30} /><span>Photo coming soon</span></div>;
}
