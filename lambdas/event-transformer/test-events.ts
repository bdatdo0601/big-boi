#!/usr/bin/env node

import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { randomUUID } from 'crypto';

/**
 * Test script to publish sample events to the BigRawBus for testing the event transformation pipeline.
 */

const publishSampleEvents = async (): Promise<void> => {
  // Initialize EventBridge client
  const eventbridge = new EventBridgeClient({});
  
  // Sample events to test different transformation scenarios
  const sampleEvents = [
    {
      Source: 'ecommerce.orders',
      DetailType: 'Order Created',
      Detail: JSON.stringify({
        order_id: randomUUID(),
        customer_id: 'cust_123',
        items: [
          { product_id: 'prod_456', quantity: 2, price: 29.99 },
          { product_id: 'prod_789', quantity: 1, price: 49.99 }
        ],
        total: 109.97,
        timestamp: new Date().toISOString(),
        status: 'pending'
      })
    },
    {
      Source: 'user.management',
      DetailType: 'User Registered',
      Detail: JSON.stringify({
        userId: randomUUID(),
        email: 'test@example.com',
        registration_date: new Date().toISOString(),
        source: 'web'
      })
    },
    {
      Source: 'inventory.system',
      DetailType: 'Stock Update',
      Detail: JSON.stringify({
        product_id: 'prod_456',
        quantity_change: -2,
        current_stock: 98,
        warehouse: 'WH001'
      })
    },
    {
      Source: 'payment.processor',
      DetailType: 'Payment Processed',
      Detail: JSON.stringify({
        payment_id: randomUUID(),
        order_id: randomUUID(),
        amount: 109.97,
        currency: 'USD',
        status: 'completed',
        processor: 'stripe'
      })
    }
  ];
  
  // Publish each event to the BigRawBus
  for (const event of sampleEvents) {
    try {
      const command = new PutEventsCommand({
        Entries: [
          {
            Source: event.Source,
            DetailType: event.DetailType,
            Detail: event.Detail,
            EventBusName: 'BigRawBus' // Make sure this matches your raw bus name
          }
        ]
      });
      
      const response = await eventbridge.send(command);
      
      console.log(`✅ Published event from ${event.Source}: ${response.Entries?.[0]?.EventId}`);
      
    } catch (error) {
      console.log(`❌ Failed to publish event from ${event.Source}: ${error}`);
    }
  }
};

const main = async (): Promise<void> => {
  console.log('🚀 Publishing sample events to BigRawBus...');
  await publishSampleEvents();
  console.log('✨ Done! Check the structured bus and CloudWatch logs to see transformed events.');
};

// Execute the main function if this script is run directly
if (require.main === module) {
  main().catch(console.error);
}
