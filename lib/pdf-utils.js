import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateOrderReceipt = (order) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(201, 168, 76); // Accent color #c9a84c
  doc.text('LUMINA GADGETS', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('Official Order Receipt', pageWidth / 2, 28, { align: 'center' });

  // Order Info
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Order ID: ${order._id || order.id}`, 20, 45);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 20, 52);
  doc.text(`Status: ${order.status?.toUpperCase()}`, 20, 59);

  // Customer Info
  doc.text('Customer Details:', 120, 45);
  doc.setFontSize(10);
  doc.text(`Name: ${order.customer?.name}`, 120, 52);
  doc.text(`Email: ${order.customer?.email}`, 120, 59);
  
  if (order.customer?.shippingAddress) {
    const addr = order.customer.shippingAddress;
    doc.setFontSize(11);
    doc.text('Delivery Address:', 20, 75);
    doc.setFontSize(10);
    doc.text(`${addr.street}`, 20, 82);
    doc.text(`${addr.city}, ${addr.zipCode}`, 20, 89);
    doc.text(`Phone: ${addr.phone}`, 20, 96);
  }

  // Table
  const tableData = order.items.map(item => [
    item.title,
    `$${item.price.toLocaleString()}`,
    item.quantity,
    `$${(item.price * item.quantity).toLocaleString()}`
  ]);

  const tableStartY = order.customer?.shippingAddress ? 110 : 75;

  doc.autoTable({
    startY: tableStartY,
    head: [['Product', 'Price', 'Qty', 'Total']],
    body: tableData,
    headStyles: { fillColor: [20, 20, 25] },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { top: 20 },
    theme: 'striped'
  });

  // Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`Total Amount: $${order.totalAmount.toLocaleString()}`, pageWidth - 20, finalY, { align: 'right' });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Thank you for shopping with Lumina.', pageWidth / 2, doc.internal.pageSize.getHeight() - 20, { align: 'center' });

  doc.save(`Lumina_Receipt_${order._id || order.id}.pdf`);
};

export const generateOrdersReport = (orders) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(22);
  doc.setTextColor(201, 168, 76);
  doc.text('LUMINA ORDER REPORT', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Total Orders: ${totalOrders}`, 20, 40);
  doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 20, 48);

  const tableData = orders.map(o => [
    o._id?.toString().slice(-6) || o.id?.slice(-6),
    o.customer?.name || 'Guest',
    new Date(o.createdAt).toLocaleDateString(),
    o.status?.toUpperCase() || 'COMPLETED',
    `$${(o.totalAmount || 0).toLocaleString()}`
  ]);

  doc.autoTable({
    startY: 60,
    head: [['ID (short)', 'Customer', 'Date', 'Status', 'Total']],
    body: tableData,
    headStyles: { fillColor: [20, 20, 25] },
  });

  doc.save(`Lumina_Order_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};
