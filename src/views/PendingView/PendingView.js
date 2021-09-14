import { FaSpinner } from 'react-icons/fa';
import s from './PendingView.module.css';

export default function PendingView() {
  return (
    <div role="alert">
      <div className={s.spinner}>
        <FaSpinner size="150" className={s.iconSpin} />
        Loading...
      </div>
    </div>
  );
}