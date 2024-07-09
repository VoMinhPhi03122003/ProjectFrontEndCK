import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import Swal from 'sweetalert2';

import {formatCurrency, getPercentDiscount} from "../../javascript/utils/Utils_Tuyen";
import {getListDiscountCode} from "../../javascript/api";
import {removeItemFromCart, updateDiscountPercent} from "../../redux/redux_tuyen/Action_Tuyen";



function SectionCart() {
    const cart = useSelector(state => state.cartReducer.cart);
    /**
     useSelector là một hook của React Redux,
     cho phép bạn lấy ra các giá trị từ Redux store.
     Bằng cách truyền một hàm selector,
     bạn có thể lựa chọn các phần của state mà bạn muốn truy xuất từ store.
     */

    return (
        <section className="shoping-cart spad">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="shoping__cart__table">
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="shoping__product">Sản phẩm</th>
                                    <th>Giá</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {cart.map(cart_item => (
                                    <ItemCart key={cart_item.id} id={cart_item.id} img={cart_item.img}
                                              name={cart_item.name}
                                              price={cart_item.price}/>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="shoping__cart__btns">
                            <Link to="/"  className="primary-btn cart-btn">Tiếp tục mua sản phẩm</Link>
                            <Link to="/" className="primary-btn cart-btn cart-btn-right">Tiếp tục mua sản phẩm</Link>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <FormInputDiscount/>
                    </div>
                    <div className="col-lg-6">
                        <TotalCart/>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ItemCart(data) {

    const [product, setProduct] = useState(data);

    const styleImage = {
        width: '60%',
        height: '60%'
    }
    const dispatch = useDispatch();

    function clickRemoveItemFromCart() {

        console.log("Product remove: ", product);
        dispatch(removeItemFromCart(product));
        Swal.fire({
            title: '',
            text: 'Sản phẩm đã xóa khỏi giỏ hàng',
            icon: 'success',
            confirmButtonText: 'OK',
            timer: 3000, // Thời gian tự động tắt thông báo sau 3 giây
            timerProgressBar: true // Hiển thị thanh tiến trình đếm ngược
        }).then(() => {

        });
    }

    return (
        <tr>
            <td><img src={`${product.img}`} style={styleImage}  alt=""/></td>
            <td className="shoping__cart__item">
                <h5>{`${product.name}`}</h5>
            </td>
            <td className="shoping__cart__price">
                {formatCurrency(product.price)}
            </td>
            <td className="shoping__cart__item__close">
                <span onClick={clickRemoveItemFromCart}>Xóa</span>
            </td>
        </tr>
    )
}

function FormInputDiscount() {

    const dispatch = useDispatch();
    const [discountCode, setDiscountCode] = useState('');

    const clickApplyDiscountCode = async (e) => {
        e.preventDefault();
        try {
            const list_discount_code = await getListDiscountCode();
            const percent = getPercentDiscount(discountCode, list_discount_code);
            console.log(percent);

            dispatch(updateDiscountPercent(percent));  // => dispatch(action) - Gửi action đến Redux store (nếu bạn sử dụng Redux)
        } catch (error) {
            console.error('Error fetching discount codes:', error);
        }
    }

    const handleDiscountCodeChange = (e) => {
        setDiscountCode(e.target.value);
    }
    // => cập nhật lại giá trị của discountCode mỗi khi người dùng nhập kí tự

    return (
        <div className="shoping__continue">
            <div className="shoping__discount">
                <h5>Mã giảm giá</h5>
                <form onSubmit={clickApplyDiscountCode}>
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá"
                        value={discountCode}
                        onChange={handleDiscountCodeChange}
                    />
                    <button type="submit" className="site-btn">Áp dụng</button>
                </form>
            </div>
        </div>
    )
}

function TotalCart() {
    const totalPrice = useSelector(state => state.cartReducer.totalPrice);
    const discount = useSelector(state => state.cartReducer.discount_percent); // phần trăm giảm giá của đơn hàng

    let content;
    if (discount > 0 && discount <= 1) {
        content = (<ul>
            <li>Tổng <span>{formatCurrency(totalPrice)}</span></li>
            <li>Giảm giá <span>{formatCurrency(discount * totalPrice)}</span></li>
            <li>Còn lại <span> {formatCurrency(totalPrice - (discount * totalPrice))}</span></li>
        </ul>);
    } else {
        content = (<ul>
            <li>Tổng <span>{formatCurrency(totalPrice)}</span></li>
        </ul>);
    }
    return (
        <div className="shoping__checkout">
            <h5>Đơn hàng</h5>
            {content}
            <a href="" className="primary-btn">Tiến hành thanh toán</a>
        </div>
    )
}

export default SectionCart;