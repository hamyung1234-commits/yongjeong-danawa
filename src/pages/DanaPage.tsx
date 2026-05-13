import { Smile } from 'lucide-react';
import ChildPage from '../components/ChildPage';

export default function DanaPage() {
  return (
    <ChildPage
      name="다나"
      icon={Smile}
      iconColor="var(--color-lavender)"
      iconBg="var(--color-lavender-light)"
      dataKey="danaData"
    />
  );
}
