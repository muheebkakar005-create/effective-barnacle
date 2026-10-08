export function formatPrice(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rs. 0';
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function calculateDiscountPercent(regularPrice: number, salePrice?: number): number {
  if (!salePrice || salePrice >= regularPrice) return 0;
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
}

export function generateWhatsAppOrderUrl(params: {
  phone?: string;
  productName: string;
  sku?: string;
  price: number;
  color?: string;
  size?: string;
  quantity?: number;
}): string {
  const targetNumber = (params.phone || '+923160367456').replace(/[^\d+]/g, '');
  const cleanNumber = targetNumber.startsWith('+') ? targetNumber.slice(1) : targetNumber;

  const lines = [
    `*As-salamu alaykum SK Brand Sami Khan!*`,
    `I would like to place an order / inquire about:`,
    ``,
    `*Product:* ${params.productName}`,
    params.sku ? `*SKU:* ${params.sku}` : '',
    params.size ? `*Size:* ${params.size}` : '',
    params.color ? `*Color:* ${params.color}` : '',
    `*Quantity:* ${params.quantity || 1}`,
    `*Price:* ${formatPrice(params.price)}`,
    ``,
    `Store: Liaqat Bazaar Quetta`,
    `Please confirm availability and bank transfer / payment instructions. Thank you!`
  ].filter(Boolean);

  const encodedMessage = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateGeneralWhatsAppUrl(phone = '+923160367456', message = 'Hello SK Brand Sami Khan! I have an inquiry about your handmade Balochi dresses and pret collection.'): string {
  const targetNumber = phone.replace(/[^\d+]/g, '');
  const cleanNumber = targetNumber.startsWith('+') ? targetNumber.slice(1) : targetNumber;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
