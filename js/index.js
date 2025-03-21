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
// let result = 0;

window.onload = function() {
    
    let firstSelection = true;  // 첫 번째 선택 여부를 확인하는 변수

    // 선택한 li 요소를 클릭했을 때 실행되는 함수
    function selectChocolate(chocolateLi) {
    // 선택한 li에서 이미지 소스 가져오기
    const imgSrc = chocolateLi.querySelector('img').src;
    const productTitle = chocolateLi.querySelector('h3').innerText;
    const productPrice = chocolateLi.querySelector('p').innerText;

    // 이미지 박스에 이미지 업데이트
    const imgBox = document.querySelector('.img-box img');
    imgBox.src = imgSrc;
    imgBox.style.opacity = 1;

    // 제품 제목과 가격 업데이트
    document.getElementById('product-title').innerText = productTitle;
    document.getElementById('price').innerText = productPrice;
    }

    // li클릭,선택시 인풋박스 수량을 0 > 1로 설정
    const quantityInput = document.querySelector('input[type="text"]');

    

    // 모든 초콜릿 li 요소에 클릭 이벤트 추가
    document.querySelectorAll('.chocolate-box li').forEach(li => {
        li.addEventListener('click', () => {
            selectChocolate(li)
            quantityInput.value = 1;
        });
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