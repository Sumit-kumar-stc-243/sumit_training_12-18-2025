function updateCartCount() {
    fetch('/cart?section_id=cart-icon-bubble')
      .then((res) => res.text())
      .then((html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const currentBubble = document.getElementById('cart-icon-bubble');
        const newBubble = doc.getElementsByClassName('cart-count-bubble')[0];
        if(newBubble && currentBubble){
          currentBubble.appendChild(newBubble)
        }
      })
      .catch((error)=>console.warn(error))
  }




document.addEventListener('click', function (e) {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;
  
    handleAddToCart(button);
  });
  
  window.handleAddToCart = function (clickedButton) {
    const variantId = clickedButton.dataset.variantId;
  
    let formData = {
      items: [
        {
          id: variantId,
          quantity: 1,
        },
      ],
    };
  
    clickedButton.disabled = true;
    clickedButton.textContent = 'Adding...';
  
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((res) => res.json())
    .then(() => fetch('/cart?section_id=cart-drawer'))
    .then((res) => res.text())
    .then((html) => {
      updateCartCount();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newDrawer = doc.getElementsByTagName('cart-drawer')[0];
      const currentDrawer = document.getElementsByTagName('cart-drawer')[0];

      if (currentDrawer) {
        currentDrawer.classList.remove('is-empty');
      }

      if (newDrawer && currentDrawer) {
        currentDrawer.innerHTML = newDrawer.innerHTML;
      }

      clickedButton.disabled = false;
      clickedButton.textContent = 'Added';

      // ✅ Proper Dawn way
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) cartDrawer.open();

    })
    .catch((error) => {
      console.error('Error:', error);
    })
  };
  