import { Baby } from 'lucide-react';
import ChildPage from '../components/ChildPage';

export default function DajungPage() {
  return (
    <ChildPage
      name="다정"
      icon={Baby}
      iconColor="var(--color-rose)"
      iconBg="var(--color-rose-light)"
      dataKey="dajungData"
    />
  );
}
