import { money } from '../data';

export function SummaryRows({
  subtotal,
  delivery,
  total,
  deliveryLabel = 'Delivery',
}: {
  subtotal: number;
  delivery: number;
  total: number;
  deliveryLabel?: string;
}) {
  return (
    <>
      <div className="summary-row"><span>Subtotal</span><span>{money(subtotal)}</span></div>
      <div className="summary-row"><span>{deliveryLabel}</span><span>{delivery ? money(delivery) : 'Free'}</span></div>
      <div className="summary-row summary-total"><span>Total</span><span>{money(total)}</span></div>
    </>
  );
}
