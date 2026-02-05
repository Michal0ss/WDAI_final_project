import { useHistory } from '../context/HistoryContext';
import { Package, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export default function History() {
  const { orders } = useHistory();

  if (orders.length === 0) {
    return (
      <div className="page-container center-container">
        <div style={{ textAlign: 'center' }}>
          <Package size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
          <h2>No Past Orders</h2>
          <p style={{ color: '#64748b' }}>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ marginBottom: '2rem' }}>Order History</h1>
      
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="order-card" style={{ 
      background: 'white', 
      border: '1px solid var(--border-color)', 
      borderRadius: '12px',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    }}>
      <div 
        className="order-header" 
        onClick={() => setExpanded(!expanded)}
        style={{ 
          padding: '1.5rem', 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: expanded ? '#f8fafc' : 'white'
        }}
      >
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Order ID</p>
            <p style={{ fontWeight: 600 }}>#{order.id}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Date</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={14} color="#64748b" />
              <span>{new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div>
             <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>Total</p>
             <p style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <span style={{ 
             padding: '0.25rem 0.75rem', 
             borderRadius: '9999px', 
             fontSize: '0.75rem', 
             fontWeight: 500,
             backgroundColor: '#dcfce7',
             color: '#166534'
           }}>
             {order.status}
           </span>
           {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="order-details" style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h4 style={{ marginBottom: '1rem' }}>Items</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                   <img src={item.image} alt={item.title} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                   <div>
                     <p style={{ fontWeight: 500 }}>{item.title}</p>
                     <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Qty: {item.quantity}</p>
                   </div>
                </div>
                <p style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
