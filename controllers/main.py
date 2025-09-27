from odoo import http
from odoo.http import request

class QuickBuyController(http.Controller):

    @http.route('/shop/quick_buy', type='http', auth='public', website=True, methods=['POST'])
    def quick_buy_form_submit(self, **post):
        """Handles quick-buy form submissions from product page."""

        try:
            product_id = int(post.get('product_id', 0))
            qty = int(post.get('add_qty', 1))
        except (TypeError, ValueError):
            return request.redirect('/shop?error=invalid_product')

        name = post.get('name', '').strip()
        address = post.get('address', '').strip()
        phone = post.get('phone', '').strip()

        if not name or not address or not phone or not product_id:
            return request.redirect('/shop?error=missing_fields')

        # Search existing partner or create one
        partner = request.env['res.partner'].sudo().search([('name', '=', name)], limit=1)
        if not partner:
            partner = request.env['res.partner'].sudo().create({
                'name': name,
                'street': address,
                'phone': phone,
            })

        # Create order in 'sale' state directly
        sale_order = request.env['sale.order'].sudo().create({
            'partner_id': partner.id,
            'website_id': request.website.id,
            'state': 'sale',
        })

        request.env['sale.order.line'].sudo().create({
            'order_id': sale_order.id,
            'product_id': product_id,
            'product_uom_qty': qty,
        })

        # ✅ Redirect to a custom thank-you page
        return request.redirect('/shop-thank-you')
