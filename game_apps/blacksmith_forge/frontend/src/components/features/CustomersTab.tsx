import React from 'react';
import { useCustomerActions } from '../../hooks/useCustomerActions';

interface CustomersTabProps { active: boolean; }

const CustomersTab: React.FC<CustomersTabProps> = ({ active }) => {
  const { currentCustomer, inventory, handleSell } = useCustomerActions();

  interface InventoryItem {
    name: string;
    icon: string;
    quality?: string;
    value: number;
    type: string;
  }

  if (!active) return null;

  return (
    <section id="customers-tab" className="tab-content active">
      <div className="customers-container">
        <h2>👥 Customer Orders</h2>
        <div className="active-customer">
          {currentCustomer ? (
            <div className="customer-card">
              <div className="customer-info">
                <div className="customer-name">{currentCustomer.icon} {currentCustomer.name}</div>
                <div className="customer-budget">Budget: {currentCustomer.budget}g</div>
              </div>
              <div className="customer-preferences">
                Looking for: {currentCustomer.preferences} weapons/armor
              </div>
              <div style={{ marginTop: '16px' }}>
                <h4>Your Inventory:</h4>
                <div className="inventory-grid">
                  {inventory.length === 0 ? (
                    <div>No items to sell. Craft something first!</div>
                  ) : (
                  inventory.map((item: InventoryItem, idx: number) => (
                    <div key={idx} className="inventory-item">
                      <div className="item-icon">{item.icon}</div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-quantity">{item.quality} Quality</div>
                      <div className="item-value">{item.value}g</div>
                      <button
                        className="btn btn--sm btn--primary"
                        style={{ marginTop: '8px' }}
                        onClick={() => handleSell(idx)}
                        disabled={item.value > currentCustomer.budget}
                      >Sell</button>
                    </div>
                  ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p>No customers waiting. Check back later!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomersTab;
