// 잔여금액 업데이트 함수 (add 함수와 독립적으로 먼저 정의)
function updateRemainingAmount() {
    const chargingInput = document.getElementsByName("charging-amount")[0];
    const currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); // 충전금액 (정수로 변환)

    // 최종금액 가져오기 (숫자만 추출하여 정수로 변환)
    const totalPayment = parseInt(document.querySelector('#modal-total-payment').innerText.replace(/[^\d]/g, ''));

    // 잔여금액 계산
    const remainingAmount = currentAmount - totalPayment; // 잔여금액 계산
    const modalRemainingAmount = document.getElementById("modal-remaining-amount");

    // 잔액이 부족한 경우
    if (remainingAmount < 0 || currentAmount < totalPayment) {
        modalRemainingAmount.innerText = "잔액이 부족합니다.";
    } else {
        // 잔여금액이 0 이상이면 표시
        modalRemainingAmount.innerText = `잔여금액: ${remainingAmount.toLocaleString()}원`;
    }
}

// 버튼클릭시 충전금액 추가하기
function add(data) {
    let chargingInput = document.getElementsByName("charging-amount")[0];
    let currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); // 현재 충전 금액을 정수로 변환

    // 새로운 금액을 계산
    let newAmount = currentAmount + data;

    // 새로운 금액을 문자열로 변환하여 설정
    chargingInput.value = newAmount.toLocaleString(); // 천 단위 구분 기호 추가

    // 모달에 충전금액 업데이트
    const modalChargingAmount = document.getElementById("modal-charging-amount");
    modalChargingAmount.innerText = `충전금액: ${newAmount.toLocaleString()}원`; // 모달 업데이트

    // 잔여금액 업데이트
    updateRemainingAmount();
};

window.onload = function() {

    // 결제 금액 업데이트 함수 (중복 제거)
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
        newImgBox.style.marginTop = '25px'; // 새 제품 간 간격

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
            priceDisplay.textContent = totalPrice.toLocaleString() + '원'; // 가격 업데이트

            updateTotalPayment();
        });

        decreaseBtn.addEventListener('click', () => {
            let currentValue = parseInt(priceValueInput.value);
            if (currentValue > 0) {
                priceValueInput.value = currentValue - 1;

                let currentPrice = parseInt(productPrice.replace(/,/g, ''));
                let totalPrice = currentPrice * (currentValue - 1);
                priceDisplay.textContent = totalPrice.toLocaleString() + '원'; // 가격 업데이트

                updateTotalPayment();
            }
        });

        // 삭제 버튼 이벤트
        const delBtn = newImgBox.querySelector('.product-del-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                newImgBox.remove(); // 해당 li를 DOM에서 제거
                updateTotalPayment(); // 결제 금액 업데이트
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
        if (shoppingBasket.style.display === "block") { // 쇼핑 바스켓이 보일 때만 위치 업데이트
            const basketRect = shoppingBasket.getBoundingClientRect();
            cart.style.left = (basketRect.left - cart.offsetWidth) + "px"; // 쇼핑 바스켓의 왼쪽에 위치
        }
    }

    function view() {
        if (shoppingBasket.style.display === 'none' || shoppingBasket.style.display === '') {
            shoppingBasket.style.display = "block";
            shoppingBasket.style.left = "68.75%";
            updateCartPosition(); // 카트 위치 업데이트

        } else {
            shoppingBasket.style.display = "none";
            cart.style.left = ""; // 카트의 위치를 원래대로 되돌리기
            cart.style.top = ""; // 카트의 위치를 원래대로 되돌리기
        }
    }
    cart.addEventListener("click", view);

    // 화면 크기가 변경될 때 카트 위치 업데이트
    window.addEventListener("resize", updateCartPosition);
};

// 모달 이벤트  
document.addEventListener('DOMContentLoaded', function() {
    const resultButton = document.getElementById("result"); 
    const modal = document.getElementById("payment-modal"); // 모달 창
    const confirmPaymentBtn = document.getElementById("confirm-payment"); // 확인 버튼

    // #result 클릭 시 모달 보이기
    resultButton.addEventListener('click', function() {
        // 모달 보이기
        modal.style.display = 'block';
    });

    confirmPaymentBtn.addEventListener('click', function() {
        // 모달 닫기
        modal.style.display = 'none';
        
        // 모든 입력값 초기화
        const chargingInput = document.getElementsByName("charging-amount")[0];
        chargingInput.value = "0"; // 충전금액 초기화
    
        // 모달에 표시된 충전금액도 초기화
        const modalChargingAmount = document.getElementById("modal-charging-amount");
        modalChargingAmount.innerText = "충전금액: 0원";
    
        // 최종금액 초기화
        const modalTotalPayment = document.getElementById('modal-total-payment');
        modalTotalPayment.innerText = "최종금액: 0원";
        
        // 잔여금액 초기화
        const modalRemainingAmount = document.getElementById("modal-remaining-amount");
        modalRemainingAmount.innerText = "잔여금액: 0원"; // 잔여금액도 초기화
    
        // 추가된 제품들 초기화 (선택된 초콜릿들 삭제)
        const productPriceBox = document.querySelector('.product-price-box ul');
        productPriceBox.innerHTML = ''; // 모든 제품 삭제
    
        // 결제 금액 업데이트 (초기화)
        const resultButton = document.getElementById('result');
        resultButton.value = "0원"; // 결제 금액도 초기화
    });
});