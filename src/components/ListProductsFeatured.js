import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux"
import {Toast} from 'react-bootstrap';
import {addCart} from '../redux/Action'
import products_featured from '../data/ProductData.js'; //=> danh sách sản phẩm nổi bật
import {formatCurrency} from '../javascript/utils';
import Pagination from '../components/Pagination/Pagination'

function ListProductsFeatured(data) {

    const [products, setProducts] = useState([]) // => trạng thái (state) ban đầu của component ListProductFeatured là []
    const [pagination, setPagination] = useState({
        _page: 1,
        _limit: 6,
        _totalRows: 100
    })
    useEffect(() => {
        // Hàm sử dụng async/await để gọi API và lấy danh sách sản phẩm nổi bật
        async function fetchListProductFeatured() {
            try {
                const requestUrl = 'http://localhost:9810/products-featured'
                // Gửi yêu cầu GET đến API và chờ nhận được phản hồi
                const response = await fetch(requestUrl);
                // Chuyển đổi phản hồi thành dữ liệu dạng JSON và chờ cho đến khi hoàn thành
                const responseJson = await response.json();

                console.log({responseJson});
                // Lưu dữ liệu vào biến data
                const data = responseJson;
                // Cập nhật state của component với dữ liệu mới lấy được từ API
                setProducts(data);

            } catch (error) {
                console.log('Khong the load danh sach san pham noi bat ', error.message)
            }
        }
        // Gọi hàm fetchListProductFeatured để lấy danh sách sản phẩm  nổi bật
        fetchListProductFeatured();



        /**
         * có 3 trường hợp khi sử dụng useEffect()
         - TH1 (ít sử dụng) : useEffect(callback)
         + Gọi callback mỗi khi component re-ender
         + Gọi callback sau khi component thêm element vào DOM
         - TH2 : useEffect(callback,[])
         + Chỉ gọi callback 1 lần sau khi component mounted
         - TH3: useEffect(callback,[deps])
         + Callback được gọi mỗi khi deps thay đổi
         **Lưu ý : Callback luôn được gọi sau khi component mount
         */
        /**
         useEffect là một hook trong React được sử dụng để thực hiện các tác vụ liên quan đến hiệu ứng (effects) trong thành phần React.
         Nó cho phép bạn thực hiện các tác vụ như gọi API, tương tác với DOM, đăng ký sự kiện, và thực hiện các tác vụ bất đồng bộ khác.
         Bạn có thể xem useEffect như một cách để "kích hoạt" các tác vụ sau khi React hoàn thành việc render giao diện người dùng.
         */

    }, [])

    function handlePageChange(newPage) {
        console.log('New page: ' + newPage)
    }
    return (
        <>
            <div className="row featured__filter">
                {products.map(product => (
                        <ItemProductFeatured key={product.id} name={product.name} img={product.img}
                                             price={product.price}></ItemProductFeatured>
                    )
                )}
            </div>
            <div className="d-flex justify-content-center">
                <Pagination pagination={pagination} onPageChange={handlePageChange}/>
            </div>
        </>
    )


}

function ItemProductFeatured(data) {

    const [product, setProduct] = useState(data)
    const [showToast, setShowToast] = useState(false)
    /**
     useState là một hook dùng để lưu trữ và quản lý state(trạng thái) của một component
     => cú pháp :
     const[state,setState] = useState(initState)
     - Component được re-render sau khi 'setState'
     - Initial state chỉ dùng cho lần đầu
     - Set state với callback ?
     - Initial state với callback ?
     - setState là thay thế state bằng giá trị mới
     */

    const dispatch = useDispatch();
    /**
     useDispatch là một hook của thư viện React Redux,
     cho phép bạn gửi các action đến Redux store từ thành phần React của bạn.
     Nó trả về một hàm mà bạn có thể sử dụng để gửi action đi.
     */


    function clickAddCart() {
        dispatch(addCart(product))
        setShowToast(true)
    }
    return (

        <div className="col-lg-3 col-md-4 col-sm-6 mix oranges fresh-meat">

            {/*Thông báo Toast*/}
            <div>
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body className="text-white" style={{backgroundColor: '#7fad39'}}>
                        Sản pẩm đã được thêm vào giỏ hàng
                    </Toast.Body>
                </Toast>
            </div>

            <div className="featured__item">
                <div className="featured__item__pic set-bg"
                     style={{backgroundImage: `url(${product.img})`}}>
                    <ul className="featured__item__pic__hover">
                        <li><a><i className="fa fa-heart"></i></a></li>
                        <li><a onClick={clickAddCart}><i className="fa fa-shopping-cart"></i></a></li>
                    </ul>
                </div>
                <div className="featured__item__text">
                    <h6><a href="">{product.name}</a></h6>
                    <h5>{formatCurrency(product.price)}</h5>


                </div>
            </div>
        </div>
    )


}

export default ListProductsFeatured;