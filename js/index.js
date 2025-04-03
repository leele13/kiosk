// 잔여금액 업데이트 함수 
function updateRemainingAmount() {
    const chargingInput = document.getElementsByName("charging-amount")[0];
    const currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); 

    // 최종금액 가져오기 (숫자만 추출하여 정수로 변환)
    const totalPayment = parseInt(document.querySelector('#modal-total-payment').innerText.replace(/[^\d]/g, ''));

    // 잔여금액 계산
    const remainingAmount = currentAmount - totalPayment; 
    const modalRemainingAmount = document.getElementById("modal-remaining-amount");

    // 잔액이 부족한 경우
    if (remainingAmount < 0 || currentAmount < totalPayment) {
        modalRemainingAmount.innerText = "잔액이 부족합니다.";
    } else {
        modalRemainingAmount.innerText = `잔여금액: ${remainingAmount.toLocaleString()}원`;
    }
}

// 버튼클릭시 충전금액 추가하기
function add(data) {
    let chargingInput = document.getElementsByName("charging-amount")[0];
    let currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); 

    // 새로운 금액을 계산
    let newAmount = currentAmount + data;

    // 새로운 금액을 문자열로 변환하여 설정
    chargingInput.value = newAmount.toLocaleString(); 

    // 모달에 충전금액 업데이트
    const modalChargingAmount = document.getElementById("modal-charging-amount");
    modalChargingAmount.innerText = `충전금액: ${newAmount.toLocaleString()}원`; 

    // 잔여금액 업데이트
    updateRemainingAmount();
};

window.onload = function() {

    function updateTotalPayment() {
        let totalPayment = 0;

        // 모든 가격 요소를 찾아서 합산
        document.querySelectorAll('.price, .second-price').forEach(priceElement => {
            let priceValue = parseInt(priceElement.innerText.replace(/,/g, '').replace('원', ''));
            totalPayment += priceValue;
        });

        // 총 결제 금액을 입력 필드에 업데이트
        const resultButton = document.getElementById('result');
        resultButton.value = totalPayment.toLocaleString() + '원 결제하기';

        // 모달에 최종금액 업데이트
        const modalTotalPayment = document.getElementById('modal-total-payment');
        modalTotalPayment.innerText = `최종금액: ${totalPayment.toLocaleString()}원`; // 모달 업데이트

        updateRemainingAmount();
    };

    

    // 초콜릿 선택 시 처리
    function selectChocolate(chocolateLi) {
        const imgSrc = chocolateLi.querySelector('img').src;
        const imgAlt = chocolateLi.querySelector('img').alt;
        const productTitle = chocolateLi.querySelector('h3').innerText;
        let productPrice = chocolateLi.querySelector('p').innerText;

        // 새로운 li를 product-price-box에 추가
        const newImgBox = document.createElement('li');
        newImgBox.innerHTML = `
            <div class="img-product-title">
                <div class="img-box">
                    <img src="${imgSrc}" alt="${imgAlt}">
                </div>
                <h3 class="product-title">${productTitle}</h3>
                <span class="product-del-btn">X</span>
            </div>
            <div class="btn-price">
                <div class="btn-box">
                    <button class="decrease">-</button>
                    <input class="price-value" type="text" value="1">
                    <button class="increase">+</button>
                </div>
                <p class="price">${productPrice}</p>
            </div>
        `;
        newImgBox.style.marginTop = '25px'; 

        // 새로운 li를 ul에 추가
        const productPriceBox = document.querySelector('.product-price-box ul');
        productPriceBox.appendChild(newImgBox);

        // 총 결제 금액 업데이트
        updateTotalPayment();

        // 제품에 대한 +, - 버튼 이벤트 추가
        const increaseBtn = newImgBox.querySelector('.increase');
        const decreaseBtn = newImgBox.querySelector('.decrease');
        const priceValueInput = newImgBox.querySelector('.price-value');
        const priceDisplay = newImgBox.querySelector('.price');

        increaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(priceValueInput.value) + 1;
            priceValueInput.value = currentValue;

            let currentPrice = parseInt(productPrice.replace(/,/g, ''));
            let totalPrice = currentPrice * currentValue;
            priceDisplay.textContent = totalPrice.toLocaleString() + '원'; 

            updateTotalPayment();
        });

        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(priceValueInput.value);
            if (currentValue > 0) {
                priceValueInput.value = currentValue - 1;

                let currentPrice = parseInt(productPrice.replace(/,/g, ''));
                let totalPrice = currentPrice * (currentValue - 1);
                priceDisplay.textContent = totalPrice.toLocaleString() + '원'; 

                updateTotalPayment();
            }
        });

        // 삭제 버튼 이벤트
        const delBtn = newImgBox.querySelector('.product-del-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                newImgBox.remove(); 
                updateTotalPayment(); 
            });
        }
    };

    // 모든 초콜릿 li 요소에 클릭 이벤트 추가
    document.querySelectorAll('.chocolate-box li').forEach(li => {
        li.addEventListener('click', () => {
            // 이전에 선택된 li에서 selected 클래스 제거
            document.querySelectorAll('.chocolate-box li').forEach(item => {
                item.classList.remove('selected');
            });

            // 클릭한 li에 selected 클래스 추가
            li.classList.add('selected');

            selectChocolate(li);
        });
    });

    // 카트 아이콘 클릭 시 장바구니(쇼핑바스켓) 보이기 
    const cart = document.querySelector("#cart");
    const shoppingBasket = document.querySelector("#shopping-basket");

    // 카트를 쇼핑 바스켓의 왼쪽에 위치시키기
    function updateCartPosition() {
        if (shoppingBasket.style.display === "block") { 
            const basketRect = shoppingBasket.getBoundingClientRect();
            cart.style.left = (basketRect.left - cart.offsetWidth) + "px"; 
        }
    }

    function view() {
        if (shoppingBasket.style.display === 'none' || shoppingBasket.style.display === '') {
            shoppingBasket.style.display = "block";
            shoppingBasket.style.left = "68.75%";
            updateCartPosition(); 

        } else {
            shoppingBasket.style.display = "none";
            cart.style.left = ""; 
            cart.style.top = ""; 
        }
    }
    cart.addEventListener("click", view);

    // 화면 크기가 변경될 때 카트 위치 업데이트
    window.addEventListener("resize", updateCartPosition);
};

// 모달 이벤트  
document.addEventListener('DOMContentLoaded', function() {
    const resultButton = document.getElementById("result"); 
    const modal = document.getElementById("payment-modal"); 
    const confirmPaymentBtn = document.getElementById("confirm-payment"); 

    // #result 클릭 시 모달 보이기
    resultButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    confirmPaymentBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        
        // 모든 입력값 초기화
        const chargingInput = document.getElementsByName("charging-amount")[0];
        chargingInput.value = "0"; 
    
        const modalChargingAmount = document.getElementById("modal-charging-amount");
        modalChargingAmount.innerText = "충전금액: 0원";
    
        const modalTotalPayment = document.getElementById('modal-total-payment');
        modalTotalPayment.innerText = "최종금액: 0원";
        
        const modalRemainingAmount = document.getElementById("modal-remaining-amount");
        modalRemainingAmount.innerText = "잔여금액: 0원"; 
    
        // 추가된 제품들 초기화 (선택된 초콜릿들 삭제)
        const productPriceBox = document.querySelector('.product-price-box ul');
        productPriceBox.innerHTML = ''; 
    
        // 결제 금액 업데이트 (초기화)
        const resultButton = document.getElementById('result');
        resultButton.value = "0원"; 
    });
});