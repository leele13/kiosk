// 버튼클릭시 충전금액 추가하기
function add(data) {
    let chargingInput = document.getElementsByName("charging-amount")[0];
    let currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); // 현재 충전 금액을 정수로 변환

    // 새로운 금액을 계산
    let newAmount = currentAmount + data;

    // 새로운 금액을 문자열로 변환하여 설정
    chargingInput.value = newAmount.toLocaleString(); // 천 단위 구분 기호 추가
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
        document.getElementById('result').value = totalPayment.toLocaleString() + '원 결제하기';
    }

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

// 모달 이벤트  // 수정할게 많다~~
const resultButton = document.getElementById("result-button"); // 리절트 버튼
const modal = document.getElementById("payment-modal"); // 모달 창
const confirmPaymentBtn = document.getElementById("confirm-payment"); // 확인 버튼
const modalChargingAmount = document.getElementById("modal-charging-amount"); // 모달 충전금액
const modalTotalPayment = document.getElementById("modal-total-payment"); // 모달 최종금액

// 충전금액 및 최종금액
let chargingAmount = 0; // 충전금액
let totalPayment = 0; // 최종금액

// 예시로 충전금액을 설정하는 함수 (실제 값은 동적으로 계산)
function setChargingAmount(amount) {
    chargingAmount += amount; // 충전금액 증가
    document.getElementById("charging-amount").value = chargingAmount; // 충전금액 업데이트
};

// 예시로 최종금액을 계산하는 함수
function setTotalPayment(amount) {
    totalPayment += amount; // 최종금액 증가
    document.getElementById("result").value = totalPayment; // 최종금액 업데이트
};

// 리절트 버튼 클릭 시 모달 띄우기
resultButton.addEventListener("click", function () {
    const remainingAmount = chargingAmount - totalPayment;

    // 충전금액과 최종금액 계산
    modalChargingAmount.innerText = `충전금액: ${chargingAmount} 원`;
    modalTotalPayment.innerText = `최종금액: ${totalPayment} 원`;

    // 모달 띄우기
    modal.style.display = "block";
});

// 모달 확인 버튼 클릭 시
confirmPaymentBtn.addEventListener("click", function () {
    completePayment(); // 결제 완료 처리
});

// 결제 완료 처리 함수
function completePayment() {
    // 결제 확인 후 처리 (예: 결제 완료 알림, 서버 전송 등)
    alert("결제가 완료되었습니다.");
    closeModal(); // 모달 숨기기
};

// 모달 닫기 함수
function closeModal() {
    modal.style.display = "none"; // 모달 숨기기
};