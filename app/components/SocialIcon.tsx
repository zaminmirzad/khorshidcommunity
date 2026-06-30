import type { LucideProps } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<LucideProps>> = {};

interface Props extends LucideProps {
  name: string;
}

export default function SocialIcon({ name, ...props }: Props) {
  const Icon = ICONS[name];
  return Icon ? <Icon {...props} /> : null;
}
