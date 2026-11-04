import { Star } from 'lucide-react';
import './practice-stars.css';

export function PracticeStars({ longestStreak, compact = false, step = 10, label }: { longestStreak: number; compact?: boolean; step?:5|10; label?:string }) {
  const milestones = [1,2,3,4,5].map(value=>value*step);
  const earned = milestones.filter(target => longestStreak >= target).length;
  const next = milestones[earned];
  return <div className={`practice-stars${compact ? ' is-compact' : ''}`}>
    <ol aria-label={`${label?label+': ':''}${earned} of 5 streak stars earned`}>
      {milestones.map(target => <li key={target} className={longestStreak >= target ? 'is-earned' : ''} aria-label={`${target} in a row: ${longestStreak >= target ? 'earned' : 'locked'}`} title={`${target} correct in a row`}>
        <Star size={compact ? 18 : 25} aria-hidden="true"/><span aria-hidden="true">{target}</span>
      </li>)}
    </ol>
    {!compact && <p>{next ? <>Reach a streak of <strong>{next}</strong> for your next star.</> : <strong>All five stars earned!</strong>}</p>}
  </div>;
}
