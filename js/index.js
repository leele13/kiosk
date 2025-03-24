// 버튼클릭시 충전금액 추가하기
function add(data) {
    let chargingInput = document.getElementsByName("charging-amount")[0];
    let currentAmount = parseInt(chargingInput.value.replace(/,/g, '')); // 현재 충전 금액을 정수로 변환

    // 새로운 금액을 계산
    let newAmount = currentAmount + data;

    // 새로운 금액을 문자열로 변환하여 설정
    chargingInput.value = newAmount.toLocaleString(); // 천 단위 구분 기호 추가
};



let product = null;
let imgBox; // 전역 변수로 imgBox 선언

window.onload = function() {
        
    let firstSelection = true;  // 첫 번째 선택 여부를 확인하는 변수

    // 선택한 li 요소를 클릭했을 때 실행되는 함수
    function selectChocolate(chocolateLi) {
    // 선택한 li에서 이미지 소스 가져오기
    imgBox = document.querySelector('.img-box img'); // imgBox를 여기서 초기화
    const imgSrc = chocolateLi.querySelector('img').src;
    const imgAlt = chocolateLi.querySelector('img').alt;
    const productTitle = chocolateLi.querySelector('h3').innerText;
    let productPrice = chocolateLi.querySelector('p').innerText;

    

    if (firstSelection) {
        // 이미지 박스에 이미지 업데이트
        // const imgBox = document.querySelector('.img-box img');
        imgBox.src = imgSrc;
        imgBox.alt = imgAlt;
        imgBox.style.opacity = 1;

        // 제품 제목과 가격 업데이트
        document.getElementById('product-title').innerText = productTitle;
        document.getElementById('price').innerText = productPrice;

        firstSelection = false; // 첫 번째 선택이 완료되었음을 표시
    } else {
        // 새로운 이미지 박스 생성
        const newImgBox = document.createElement('li'); // <li> 요소 생성
        newImgBox.innerHTML = `
            <div class="img-product-title">
                <div class="img-box">
                    <img src="${imgSrc}" alt="${imgAlt}" style="opacity: 1;"> <!-- 오파시티를 1로 설정 -->
                </div>
                <h3 id="product-title">${productTitle}</h3>
                <span id="product-del-btn">X</span>
            </div>
            <div class="btn-price">
                <div class="btn-box">
                    <button id="second-decrease" >-</button>
                    <input id="second-price-value" type="text" value="1">
                    <button id="second-increase" >+</button>
                </div>
                <p id="second-price">${productPrice}</p>
            </div>
        `;
        // newImgBox.style.opacity = 1;
        newImgBox.style.marginTop = '25px';

        // <div class="product-price-box"> 안의 <ul>에 새로운 li 추가
        const productPriceBox = document.querySelector('.product-price-box ul');
        productPriceBox.appendChild(newImgBox); // 새로운 박스를 DOM에 추가

        // 두번째 li에 있는 del 버튼 클릭 이벤트 추가
        const secondDelBtn = newImgBox.querySelector('#product-del-btn');
        if (secondDelBtn) { // 버튼이 존재하는지 확인
            secondDelBtn.addEventListener('click', () => {
                console.log('삭제 버튼 클릭됨');
                newImgBox.remove(); // 해당 li를 DOM에서 제거
            });
        }       

        const secondIncreaseBtn = newImgBox.querySelector('#second-increase');
        let secondQuantityInput = newImgBox.querySelector('#second-price-value');
        let secondPriceDisplay = newImgBox.querySelector('#second-price');

        secondIncreaseBtn.addEventListener('click', () => {  // +버튼 

        secondQuantityInput.value = parseInt(secondQuantityInput.value) + 1;

        let chocolatePriceElement = getChocolatePrice(); // 선택된 li의 가격 가져오기
        let totalPrice = chocolatePriceElement * secondQuantityInput.value;
        secondPriceDisplay.textContent = totalPrice.toLocaleString() + '원'; // 가격을 원화 형식으로 표시

        // console.log(secondQuantityInput.value);
        // console.log("세컨드");    

        const secondDecreaseBtn = newImgBox.querySelector('#second-decrease'); // - 버튼 

        secondDecreaseBtn.addEventListener('click', () => {
            // 현재 수량을 정수로 변환하고 1을 뺀 값을 설정
            let currentQuantity = parseInt(secondQuantityInput.value);
            console.log(currentQuantity+"값 나와주세요");
            if (currentQuantity > 0) { // 수량이 0보다 클 때만 감소
                secondQuantityInput.value = currentQuantity - 1;

                let chocolatePriceElement = getChocolatePrice(); // 선택된 li의 가격 가져오기
                let totalPrice = chocolatePriceElement * secondQuantityInput.value;
                secondPriceDisplay.textContent = totalPrice.toLocaleString() + '원'; // 가격을 원화 형식으로 표시
            }
        });
    });

    }

    // del버튼 클릭시 이벤트 
    const delBtn = document.getElementById('product-del-btn');
    delBtn.addEventListener('click', () => {
        // chocolateLi.remove(); // 해당 li를 DOM에서 제거
        // 기존 이미지 박스도 제거
    const imgBoxLi = document.querySelector('.product-price-box ul li.first-box'); // 기존 이미지 박스가 있는 li 선택
        if (imgBoxLi) {
            imgBoxLi.remove(); // 기존 이미지 박스 제거
        }
    });
}
    const increaseBtn = document.getElementById('increase');
    let quantityInput = document.getElementById('price-value');
    let priceDisplay = document.getElementById('price');


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
        quantityInput.value = 1;
    });
});

// 가격을 가져오는 함수
function getChocolatePrice() {
    let selectedLi = document.querySelector('.chocolate-box ul li.selected'); // 선택된 li 요소
    if (selectedLi) {
        return parseFloat(selectedLi.querySelector('p').innerText.replace(/,/g, '')); // 선택된 li의 p 값
    }
    return 0; // 선택된 li가 없을 경우 0 반환
    };

    // console.log(chocolatePriceElement);
    // if (typeof chocolatePriceElement === "string") {
    //     console.log ("문자열");
    // } else (
    //     console.log("숫자")
    // )
    
    increaseBtn.addEventListener('click', () => {

        quantityInput.value = parseInt(quantityInput.value) + 1;

        let chocolatePriceElement = getChocolatePrice(); // 선택된 li의 가격 가져오기
        let totalPrice = chocolatePriceElement * quantityInput.value;
        priceDisplay.textContent = totalPrice.toLocaleString() + '원'; // 가격을 원화 형식으로 표시

        // console.log(quantityInput.value);
        // console.log("+기존");    
    });











    // 카트 아이콘 클릭시 장바구니(쇼핑바스켓) 보이기 
    const cart = document.getElementById("cart");
    const shoppingBasket = document.getElementById("shopping-basket");

    // 카트를 쇼핑 바스켓의 왼쪽에 위치시키기
    function updateCartPosition() {
        const basketRect = shoppingBasket.getBoundingClientRect();
        cart.style.left = (basketRect.left - cart.offsetWidth) + "px"; // 쇼핑 바스켓의 왼쪽에 위치
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

     // 카트 아이콘을 눌렀을때만 장바구니가 닫히도록 설정하는 부분, 이 값을 주지 않아도 카트 아이콘 클릭했을때만 장바구니가 닫혀서 주석처리해둠.
    // cart.addEventListener("click", function(e) {  
    //     e.stopPropagation();
    //     view();
    // });
}; 