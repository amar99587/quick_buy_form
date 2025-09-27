/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";

const formatCapital = (value) => {
    if (value) {
      // Split the value into integer and decimal parts
      let [integerPart, decimalPart] = value.toString().split('.');
  
      // convert it from string to number then back to string to remove the first zero
      integerPart = `${+integerPart}`
  
      // Format the integer part with spaces every three digits
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
      // Ensure the decimal part is always two digits
      if (decimalPart !== undefined) {
        decimalPart = decimalPart.slice(0, 2); // Limit to two digits
        return `${integerPart}.${decimalPart.length == 1 ? decimalPart + '0' : decimalPart}`;
      }
  
      return integerPart + '.00';
    }
    return "00.00";
};

publicWidget.registry.QuickBuyConfirm = publicWidget.Widget.extend({
    selector: "#quick_buy_form",
    events: {
        'click #quick_buy_button': '_onClickBuyNow',
    },

    _onClickBuyNow: function (ev) {
        ev && ev.preventDefault();

        // If browser supports HTML5 validation, honor it
        if (typeof this.el.reportValidity === 'function' && !this.el.reportValidity()) {
            return;
        }

        const name = (this.el.querySelector('#name') || {}).value || '';
        const address = (this.el.querySelector('#address') || {}).value || '';
        const phone = (this.el.querySelector('#phone') || {}).value || '';

        this._ensureModal();
        const modal = document.querySelector('.quick-buy-modal');
        modal.querySelector('.qb-name').textContent = name;
        modal.querySelector('.qb-address').textContent = address;
        modal.querySelector('.qb-phone').textContent = phone;

        const productName = (this.el.querySelector('#product_name') || {}).value || '';
        const productImg = (this.el.querySelector('#product_image') || {}).value || '';
        const productPrice = parseFloat((this.el.querySelector('#product_price') || {}).value) || 0;
        const quantity = parseInt(document.querySelector('input[name="add_qty"]')?.value) || 1;

        // Fill modal
        modal.querySelector('.qb-product-name').textContent = productName;
        modal.querySelector('.qb-price').textContent = formatCapital(productPrice);

        // update hidden field inside quick_buy_form
        (this.el.querySelector('#quick_qty') || {}).value = quantity;

        // Calculate final price
        modal.querySelector('.qb-quantity').textContent = quantity;
        modal.querySelector('.qb-final').textContent = formatCapital(quantity * productPrice);

        const imgContainer = modal.querySelector('.qb-product-img');
        if (imgContainer) {
            imgContainer.innerHTML = `<img src="${productImg}" alt="${productName}"/>`;
        }

        modal.classList.add('qb-show');

        // prevent background scroll while modal open
        document.body.style.overflow = 'hidden';
        modal.querySelector('.qb-confirm').focus();
    },

    _ensureModal: function () {
        if (document.querySelector('.quick-buy-modal')) return;

        const modal = document.createElement('div');
        modal.className = 'quick-buy-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
            <div class="qb-dialog">
                <header class="d-flex justify-content-between">
                    <div class="fw-bold" style="font-size: 1.2rem;">Confirm Your Order</div>
                    <button type="button" class="qb-close fs-4" aria-label="Close">&times;</button>
                </header>

                <main class="d-grid gap-3">
                    <div class="d-grid gap-2">
                        <div class="d-flex align-items-center gap-4">
                            <div class="fw-semibold" style="min-width: fit-content;">Product Details</div>
                            <hr style="border-top: 1px solid #d8d8d8;width: 100%;">
                        </div>
                        <div class="d-flex justify-content-between gap-3">
                            <div class="qb-product-img"></div>
                            <div class="d-grid gap-2 flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="qb-product-name" style="font-size: 1.15rem;"></span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span>Unit price:</span>
                                    <div class="fs-6">
                                        <span class="qb-price mx-1"></span>
                                        <small class="fs-7 text-muted">DZD</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <div class="d-flex align-items-center gap-4">
                            <div class="fw-semibold" style="min-width: fit-content;">Shipping Details</div>
                            <hr style="border-top: 1px solid #d8d8d8;width: 100%;">
                        </div>
                        <div class="d-grid gap-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Fullname:</span>
                                <span class="qb-name">Laziri Amar</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Adress:</span>
                                <span class="qb-address">Ahmed Faoussi 186</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Phone:</span>
                                <span class="qb-phone">0698467691</span>
                            </div>
                        </div>
                    </div>

                    <div class="d-grid gap-2">
                        <div class="d-flex align-items-center gap-4">
                            <div class="fw-semibold" style="min-width: fit-content;">Order Summary</div>
                            <hr style="border-top: 1px solid #d8d8d8;width: 100%;">
                        </div>
                        <div class="d-grid gap-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Quantity:</span>
                                <span class="qb-quantity fw-semibold">1</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span>Total Price:</span>
                                <div class="fs-5">
                                    <span class="qb-final fw-bold mx-1">3900.00</span>
                                    <small class="fs-7 text-muted">DZD</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer class="d-flex justify-content-end gap-2 mt-2">
                    <button type="button" class="qb-cancel btn btn-light px-3">Cancel</button>
                    <button type="button" class="qb-confirm btn btn-primary px-3">Confirm</button>
                </footer>
            </div>
        `;
        
        document.body.appendChild(modal);

        // Wire up buttons (use arrow functions to keep `this` reference)
        const closeBtn = modal.querySelector('.qb-close');
        const cancelBtn = modal.querySelector('.qb-cancel');
        const confirmBtn = modal.querySelector('.qb-confirm');

        closeBtn.addEventListener('click', () => this._hideModal());
        cancelBtn.addEventListener('click', () => this._hideModal());
        confirmBtn.addEventListener('click', () => this._onClickConfirm());

        // Click on backdrop to close
        modal.addEventListener('click', (e) => { if (e.target === modal) this._hideModal(); });

        // Close on ESC
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._hideModal(); });
    },

    _hideModal: function () {
        const modal = document.querySelector('.quick-buy-modal');
        if (!modal) { return; }
        modal.classList.remove('qb-show');
        document.body.style.overflow = '';
    },

    _onClickConfirm: function () {
        // hide modal first so UI isn't blocked during redirect
        this._hideModal();
        // small delay to allow modal to animate out
        setTimeout(() => { this.el.submit(); }, 120);

    },
});
