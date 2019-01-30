"use strict"
var lots;
var cart = {
    items: {},
    dom: {
        openBtn: '#cart_visibility',
        itemMenu: '.dropdown-menu',
        item: '.dropdown-menu>li'
    },
    setActionOnOpenCartBtn: function() {
        $('body').on('click', '#cart_visibility', function (btn) {
            $("#cart_visibility").toggleClass('open');
            cart.rebuildCart();
        });
    },
    addToCart: function(event, el) {
        let tempCart = {};
        if (getCookie('cart') != undefined) {
            tempCart = JSON.parse(getCookie('cart'));    
        }
        let curCartElement = {};
        let id = $(el).attr('id');
        

        let curLot = lots.find(function (lot) {
            if(lot.id == id){
                return lot;
            }
        })

        if (tempCart[id] != undefined && tempCart[id].count > 0) {
            tempCart[id].count += 1;
        } else {
            curCartElement.id = id;
            curCartElement.title = curLot.title;
            curCartElement.price = curLot.start_price;
            curCartElement.count = 1;
            tempCart[id] = curCartElement;
        } 

        setCookie('cart', JSON.stringify(tempCart), {path: '/'});

        this.rebuildCart();
        event.preventDefault();
    },
    removeFromCart: function(event, el) {
        let id = $(el).attr('id');
        
        let tempCart = JSON.parse(getCookie('cart'));
        delete(tempCart[id]);
        setCookie('cart', JSON.stringify(tempCart), {path: '/'});
        
        cart.rebuildCart();
        event.preventDefault();
    },
    rebuildCart: function() {
        $(cart.dom.item).remove();

        if (getCookie('cart') == undefined || getCookie('cart') == '{}') {
            $(cart.dom.itemMenu).append(
                `<li class="cart__empty-text">Корзина пуста</li>`
            );
            $(".cart__text").html(0 + ' грн');
            $(".cart__count").html(0);
            return;
        }

        let tempCart = JSON.parse(getCookie('cart'));
        let totalAmount = 0;
        let totalCount = 0;
        $.each(tempCart, function(id, item){
            totalCount += item.count;
            totalAmount += item.count * item.price;
            $(".cart__text").html(totalAmount + ' грн');
            $(".cart__count").html(totalCount);
            $(cart.dom.itemMenu).append(
                    `<li class="with-remove">
                        <a href="" class="cart-product">
                            <div class="cart-product__img">
                                <img src="images/image-lot.jpeg" alt="">
                            </div>
                            <div class="cart-product__content">
                                <div class="cart-product__title">
                                    ${item.title}
                                </div>
                                <span class="cart-product__count">
                                    <span class="cart-product__counter">
                                    ${item.count}
                                    </span> х 
                                    <span class="cart-product__price">
                                        ${item.price} грн
                                    </span>
                                </span>
                            </div>
                        </a>
                        <a class="remove-ico">
                            <i class="fa fa-times"
                                id="${item.id}"
                                onclick="cart.removeFromCart(event, this)">
                            </i>
                        </a>
                    </li>`            
                )
        })
        
    }
}
getLots();
function getLots() {
    return new Promise((resolve, reject) => {
        $.getJSON('data/60.json', function(data) {
            resolve(data);
        });
    });
};
getLots().then(data => {    
    lots = data.lots;
    initialization();
});

function initialization() {
    buildProductGrid();
    cart.setActionOnOpenCartBtn();
    cart.rebuildCart();
}

function buildProductGrid () {
    lots.map(function (lot) {
        $('#products').append(
            `<div class="col-xs-6 col-md-3 product__wrapper">
                <div class="product">
                    <div class="product__image">
                        <img class="" src="images/image-lot.jpeg" alt="">
                    </div>
                    <div class="product__content">
                        <p class="product__title">
                            ${lot.title}
                        </p>
                    </div>
                    <div class="product__price-wrapper">
                        <a href="#" class="product__compare-text first">К сравнению</a>
                        <div class="product__subprice">
                        <p class="product__price">
                            ${lot.start_price} грн
                        </p>
                    </div>
                    <div class="product__submit">
                        <button class="btn product__btn" id="${lot.id}" onclick="cart.addToCart(event, this)">в корзину
                        </button>
                        <a href="#" class="product__compare-text second">К сравнению</a>
                    </div>
                </div>
            </div>
        </div>`
        );   
    })
}
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}
function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}