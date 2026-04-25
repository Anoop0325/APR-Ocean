import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

def generate_invoice_pdf(order):
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    p.setFont("Helvetica-Bold", 16)
    p.drawString(50, height - 50, "APR Osean Interprise - Invoice")
    
    p.setFont("Helvetica", 10)
    p.drawString(50, height - 70, f"Order ID: #{order.id}")
    p.drawString(50, height - 85, f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}")
    p.drawString(50, height - 100, f"Customer Phone: {order.user.phone_number}")

    p.line(50, height - 120, width - 50, height - 120)
    p.drawString(50, height - 135, "Product")
    p.drawString(300, height - 135, "Qty")
    p.drawString(350, height - 135, "Price")
    p.drawString(450, height - 135, "Total")
    p.line(50, height - 140, width - 50, height - 140)

    y = height - 155
    for item in order.items.all():
        p.drawString(50, y, item.product.name[:35])
        p.drawString(300, y, str(item.quantity))
        p.drawString(350, y, f"Rs. {item.price_at_purchase}")
        p.drawString(450, y, f"Rs. {item.price_at_purchase * item.quantity}")
        y -= 15
        if y < 100:
            p.showPage()
            y = height - 50

    p.line(50, y - 10, width - 50, y - 10)
    p.setFont("Helvetica-Bold", 12)
    p.drawString(350, y - 30, "Grand Total:")
    p.drawString(450, y - 30, f"Rs. {order.total_amount}")

    p.setFont("Helvetica-Oblique", 8)
    p.drawString(50, 50, "Thank you for shopping with APR Osean Interprise!")

    p.showPage()
    p.save()

    buffer.seek(0)
    return buffer
