import React, { useState } from 'react'
import orderApi from '../../services/orderApi'

function OrderDebugPage() {
  const [logs, setLogs] = useState([])
  const append = (msg) => setLogs((s) => [msg, ...s])

  const runChecks = async () => {
    setLogs([])
    try {
      append('Checking fetchOrderHistory...')
      const history = await orderApi.fetchOrderHistory()
      append('fetchOrderHistory OK: ' + JSON.stringify(history))
    } catch (err) {
      append('fetchOrderHistory ERROR: ' + (err.response?.status || '') + ' ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message))
    }

    try {
      append('Checking fetchOrder(1)...')
      const order = await orderApi.fetchOrder(1)
      append('fetchOrder OK: ' + JSON.stringify(order))
    } catch (err) {
      append('fetchOrder ERROR: ' + (err.response?.status || '') + ' ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message))
    }

    try {
      append('Checking placeOrder (dry run)')
      const payload = { phone: '+000', shipping_address: 'Debug Address', notes: 'debug' }
      const placed = await orderApi.placeOrder(payload)
      append('placeOrder OK: ' + JSON.stringify(placed))
    } catch (err) {
      append('placeOrder ERROR: ' + (err.response?.status || '') + ' ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message))
    }

    try {
      append('Checking cancelOrder(1)...')
      const res = await orderApi.cancelOrder(1)
      append('cancelOrder OK: ' + JSON.stringify(res))
    } catch (err) {
      append('cancelOrder ERROR: ' + (err.response?.status || '') + ' ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message))
    }

    try {
      append('Checking requestRefund(1)...')
      const res = await orderApi.requestRefund(1)
      append('requestRefund OK: ' + JSON.stringify(res))
    } catch (err) {
      append('requestRefund ERROR: ' + (err.response?.status || '') + ' ' + (err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message))
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Order API Debug</h1>
      <p>Run these checks to ensure your backend order endpoints are reachable and returning expected responses.</p>
      <button onClick={runChecks} style={{ padding: '8px 12px', marginBottom: 12 }}>Run Checks</button>

      <div style={{ background: '#111', color: '#fff', padding: 12, borderRadius: 6, maxHeight: '60vh', overflow: 'auto' }}>
        {logs.length === 0 && <div style={{ color: '#aaa' }}>No logs yet — press Run Checks</div>}
        {logs.map((l, idx) => (
          <pre key={idx} style={{ whiteSpace: 'pre-wrap', margin: '6px 0' }}>{l}</pre>
        ))}
      </div>
    </div>
  )
}

export default OrderDebugPage
