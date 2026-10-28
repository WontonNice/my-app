import { mealEstimate, type MealOrderedRequest } from '../../../server/src/shared/classroomMeals';

export function MealOrderHistory({ orders, teacher = false }: { orders: MealOrderedRequest[]; teacher?: boolean }) {
  if (!orders.length) return null;
  return <section className="meal-order-history" aria-label="Previously ordered meals">
    <h2>Previously ordered meals ({orders.length})</h2>
    {orders.map((order, index) => <details key={`${order.student_id}:${order.revision}`}>
      <summary><strong>{teacher ? order.data.studentName : `Request ${index + 1}`} · Ordered</strong><span>{mealEstimate(order.data.quote)} estimated · <time dateTime={order.updated_at}>{new Date(order.updated_at).toLocaleString()}</time></span></summary>
      <ul>{order.data.quote.items.map(item => <li key={item.id}><strong>{item.quantity} × {item.name}</strong>{item.restaurant && <span>{item.restaurant}</span>}{item.customizations?.map((choice, choiceIndex) => <span key={choiceIndex}>{choice.group}: {choice.option}</span>)}</li>)}</ul>
      {order.data.notes && <p><strong>Note:</strong> {order.data.notes}</p>}
    </details>)}
  </section>;
}
