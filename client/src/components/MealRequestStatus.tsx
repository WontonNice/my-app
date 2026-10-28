import { CheckCircle2, CircleMinus, Clock3, XCircle } from 'lucide-react';
import { mealEstimate, type MealOrder } from '../../../server/src/shared/classroomMeals';

export function MealRequestStatus({ order, orderingOpen, onStartAnother, onCancelAnother, startingAnother = false }: {
  order: MealOrder; orderingOpen: boolean; onStartAnother?: () => void; onCancelAnother?: () => void; startingAnother?: boolean;
}) {
  const state = order.data.teacherDecision ?? order.status;
  const status = {
    ordered: {
      Icon: CheckCircle2, title: 'Your teacher ordered your meal',
      description: !orderingOpen ? 'Your saved request is marked ordered. Ordering is closed for new requests.'
        : startingAnother ? 'Choose items below for your next request. Your earlier ordered meal stays saved.'
          : 'Your ordered meal stays saved. You can start another request while ordering is open.',
    },
    removed: {
      Icon: CircleMinus, title: 'Your teacher removed your request',
      description: orderingOpen
        ? 'This request is no longer on your teacher’s list. Choose items below to send a new request.'
        : 'This request is no longer on your teacher’s list. Ordering is closed, so ask your teacher about next steps.',
    },
    denied: {
      Icon: XCircle, title: 'Your teacher declined your request',
      description: 'Ask your teacher to restore your request before you can send or update it.',
    },
    submitted: {
      Icon: Clock3, title: 'Request sent. Waiting for your teacher.',
      description: orderingOpen
        ? 'Your teacher has your request. You can update it until your teacher marks it ordered.'
        : 'Your teacher has your request. Ordering is closed for changes.',
    },
    cancelled: {
      Icon: CircleMinus, title: 'You cancelled your request',
      description: orderingOpen ? 'Choose items below when you’re ready to send a new request.' : 'Ordering is closed. Ask your teacher if you want to send another request.',
    },
  }[state];
  const { Icon } = status;
  const quantity = order.data.quote.items.reduce((sum, item) => sum + item.quantity, 0);

  return <section className={`meal-request-status is-${state}`} aria-label="Meal request status">
    <div className="meal-request-status-message" role="status" aria-atomic="true">
      <Icon className="meal-request-status-icon" size={32} strokeWidth={1.8} aria-hidden="true" />
      <div><h2>{status.title}</h2><p>{status.description}</p>
        {state === 'removed' && order.data.previousStatus === 'ordered' && <p>Removing this request does not cancel an order already placed on Uber Eats. Check with your teacher.</p>}
      </div>
    </div>
    {state === 'ordered' && orderingOpen && onStartAnother && <div className="meal-request-status-actions"><button type="button" onClick={startingAnother ? onCancelAnother : onStartAnother}>{startingAnother ? 'Discard new request' : 'Start another request'}</button></div>}
    <details className="meal-request-receipt">
      <summary>View {state === 'removed' || state === 'denied' || state === 'cancelled' ? 'previous' : 'saved'} request{' '}<span>{quantity} {quantity === 1 ? 'item' : 'items'} · {mealEstimate(order.data.quote)} estimated</span></summary>
      <ul>{order.data.quote.items.map(item => <li key={item.id}><strong>{item.quantity} × {item.name}</strong>{item.restaurant && <span>{item.restaurant}</span>}{item.customizations?.map((choice, index) => <span key={index}>{choice.group}: {choice.option}</span>)}</li>)}</ul>
      {order.data.notes && <p><strong>Your note:</strong> {order.data.notes}</p>}
    </details>
  </section>;
}
