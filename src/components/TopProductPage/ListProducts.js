import Header from "../Commons/Header";
import Footer from "../Commons/Footer"


import '../../css/products.css'
import {useEffect,useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {products} from "../../data/Products";
import {setLayout, setPage, setSort, setType} from "../../redux/Action";
import SectionBreadcrumb from "../Commons/SectionBreadcrumb";
import {Link} from "react-router-dom";
import {StarRate} from "../ProductDetailPage/ProductDetails";
import {formatNumber, formatRating} from "../../javascript/utils";



export function PopularProducts() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch('http://localhost:9810/products?_sort=downloaded,viewed&_order=desc&_limit=10')
            .then(res => res.json())
            .then(json => setData(json.data))
    }, [])

    return (
        <div className="sidebar-item sidebar-popular mt-5">
            <h6 className="list-group-item">Sản phẩm phổ biến</h6>
            <div className="list-group">
                {data.map((product, index) => (
                    <Link to={`product/${product.id}`}  state={product} className="list-group-item" key={index}>
                        <img className="mr-2" src={product.img} alt=""/>
                        <span className="popular-title">{product.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}
const getTypes = (json) => {
    const types = []
    json.data.forEach(product => {
        const type = types.find(value => value.name === product.type.name)
        if (type) {
            type.quantity = type.quantity + 1
        } else {
            types.push({name: product.type.name, icon: product.type.icon, quantity: 1})
        }
    })
    return types.sort((a, b) => a.name < b.name ? -1 : 1)
}


function SideBar({type}) {
    const dispatch = useDispatch()

    const relTypes = useRef([])

    useEffect(() => {
        fetch(`http://localhost:9810/products`)
            .then(res => res.json())
            .then(json => relTypes.current = getTypes(json))
    }, [])

    function handleClick(type) {
        dispatch(setType(type))
        dispatch(setPage(1))
    }

    return (
        <div className="sidebar">
            <div className="sidebar-item">
                <h6 className="list-group-item">Phân loại sản phâm</h6>
                <div className="list-group">
                    {relTypes.current.map((value, index) => (
                        <div className={`list-group-item ${value.name === type && 'item-active'}`} key={index}
                             onClick={() => handleClick(value.name)}>
                            <div>
                                <span><i className={value.icon}></i></span>
                                <span>{value.name}</span>
                            </div>
                            <span className="badge badge-light">{value.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
            <PopularProducts/>
        </div>
    )
}

function ProductItem({p, navigate}) {
    return (
        <div className="product-item">
            <Link to={`product/${p.id}`} state={p} className="product-item-img">
                <img src={p.img} alt=""/>
            </Link>
            <div className="product-item-title d-flex justify-content-center align-items-center text-center pt-2">
                <div className="title-wrapper">
                    <Link to={`product/${p.id}`} state={p}>{p.name}</Link>
                </div>
            </div>
            <div className="product-item-stats d-flex justify-content-between">
                <div><i className="fa fa-eye"></i> {p.viewed}</div>
                <div><i className="fa fa-download"></i>{p.downloaded}</div>
            </div>
            <div className="product-item-actions d-flex justify-content-between align-items-center">
                <div className="d-flex justify-content-start">
                    <a className="product-item-action mr-1"><i className="fa fa-thumbs-up"></i></a>
                    <a className="product-item-action"><i className="fa fa-shopping-cart"></i></a>
                </div>
                <div className="product-item-stars"><StarRate stars={formatRating(p.rating).average} type={"bi bi-star-fill"}/></div>
            </div>
            <div className="product-item-bottom d-flex justify-content-between align-items-center">
                <div className="product-item-brand" onClick={() => navigate(p.type.name)}><i
                    className={p.type.icon}></i> {p.type.name}</div>
                <Link to={`product/${p.id}`} state={p} className="product-item-price">{formatNumber(p.price, '.')}đ</Link>
            </div>
        </div>
    )
}

function ProductItemRow({p, navigate}) {
    return (
        <div className="product-item-row mb-4">
            <div className="row no-gutters">
                <Link to={`product/${p.id}`} state={p} className="product-item-img col-lg-4 pr-3">
                    <img src={p.img} alt=""/>
                </Link>
                <div className="product-item-row-content col-lg-6">
                    <Link to={`product/${p.id}`} state={p} className="product-item-row-title">{p.name}</Link>
                    <div className="product-item-brand"><i className={p.type.icon}
                                                           onClick={() => navigate(p.type.name)}></i> {p.type.name}
                    </div>
                    <div className="product-item-stars"><StarRate stars={formatRating(p.rating).average}
                                                                  type={"bi bi-star-fill"}/></div>
                    <div className="product-item-stats d-flex justify-content-start">
                        <div><i className="fa fa-eye"></i> {p.viewed}</div>
                        <div><i className="fa fa-download"></i> {p.downloaded}</div>
                    </div>
                </div>
                <div className="col-lg-2 d-flex flex-column justify-content-end align-items-end">
                    <div className="pr-3 pb-3">
                        <div className="product-item-row-price text-center">
                            <Link to={`product/${p.id}`} state={p} className="d-inline text-center">{formatNumber(p.price, '.')}đ</Link>
                        </div>
                        <div className="d-flex justify-content-end">
                            <a className="product-item-action mr-1"><i className="fa fa-thumbs-up"></i></a>
                            <a className="product-item-action"><i className="fa fa-shopping-cart"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Products(props) {
    const layout = useSelector(state => state.listProductsReducer.layout)
    const dispatch = useDispatch()

    function navigate(type) {
        dispatch(setType(type))
        dispatch(setPage(1))
    }


    return (
        <div className="row">
            {props.data.map((value, index) => {
                return layout === 'grid' ?
                    (<div className="product-item-container col-lg-4 col-md-6 col-sm-6" key={index}>
                        <ProductItem p={value}  navigate={navigate}/>
                    </div>) :
                    (<div className="product-item-container col-12" key={index}>
                        <ProductItemRow p={value}/>
                    </div>)
            })}
        </div>
    )
}

function Filter({total}) {
    const sort = useSelector(state => state.listProductsReducer.sort)
    const layout = useSelector(state => state.listProductsReducer.layout)
    const dispatch = useDispatch()
    return (
        <div className="filters mb-4">
            <div className="row">
                <div className="col-lg-4 d-flex justify-content-start align-items-center">
                    <div className="filter-found">
                        <h6>Tìm thấy <b>{total}</b> sản phẩm</h6>
                    </div>
                </div>
                <div className="col-lg-8 d-flex justify-content-end align-items-center">
                    <div className="filter-sort mr-5">
                        <span>SẮP XẾP</span>
                        <ul className="d-inline-block">
                            <li className={sort === null && "filter-active"} onClick={() => dispatch(setSort(null))}>Mới
                                nhất
                            </li>
                            <li className={sort === 'viewed' && "filter-active"}
                                onClick={() => dispatch(setSort('viewed'))}>Xem nhiều
                            </li>
                            <li className={sort === 'downloaded' && "filter-active"}
                                onClick={() => dispatch(setSort('downloaded'))}>Tải nhiều
                            </li>
                        </ul>
                    </div>
                    <div className="filter-layout d-flex align-items-center">
                        <span className={`bx bx-grid-alt ${layout === 'grid' && "filter-active"}`}
                              onClick={() => dispatch(setLayout('grid'))}></span>
                        <span className={`bx bx-list-ul ${layout === 'row' && "filter-active"}`}
                              onClick={() => dispatch(setLayout('row'))}></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Pagination({total}) {

    const currentPage = useSelector(state => state.listProductsReducer.page)
    const dispatch = useDispatch()
    const numbers = [...Array(Math.ceil(total / 12) + 1).keys()].slice(1)


    function onSwitchPage(page) {
        const pages = numbers.length
        const pageNow = page < 1 || page > pages ? currentPage : page
        dispatch(setPage(pageNow))
    }

    return (
        <ul className="product-pagination float-right mt-3">
            <li onClick={() => onSwitchPage(currentPage - 1)}><i className="fa fa-chevron-left"></i></li>
            {numbers.map((value, index) => (
                <li className={value === currentPage && "active"} key={index}
                    onClick={() => onSwitchPage(value)}>{value}</li>
            ))}
            <li onClick={() => onSwitchPage(currentPage + 1)}><i className="fa fa-chevron-right"></i></li>
        </ul>
)
}

function ProductsContainer() {
    const page = useSelector(state => state.listProductsReducer.page)
    const type = useSelector(state => state.listProductsReducer.type)
    const sort = useSelector(state => state.listProductsReducer.sort)

    const [products, setProducts] = useState([])
    const relTotal = useRef(0)

    useEffect(() => {
        let url
        if (type) {
            if (sort) {
                url = `http://localhost:9810/products?type.name=${type}&_page=${page}&_limit=12&_sort=${sort}&_order=desc`
            } else {
                url = `http://localhost:9810/products?type.name=${type}&_page=${page}&_limit=12`
            }
        } else {
            if (sort) {
                url = `http://localhost:9810/products?_page=${page}&_limit=12&_sort=${sort}&_order=desc`
            } else {
                url = `http://localhost:9810/products?_page=${page}&_limit=12`
            }
        }
        fetch(url)
            .then(res => res.json())
            .then(json => {
                setProducts(json.data)
                relTotal.current = json.total
            })
    }, [page, type, sort])

    return (
        <section className="product">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-5">
                        <SideBar type={type}/>
                    </div>
                    <div className="col-lg-9 col-md-7 pl-4">
                        <Filter total={relTotal.current}/>
                        <Products data={products}/>
                        <Pagination total={relTotal.current}/>
                    </div>
                </div>
            </div>
        </section>
    )
}

export  default  function ListProducts() {
    return (
        <>
            <Header/>
            {/*<SectionBreadcrumb/>*/}
            <ProductsContainer/>
            <Footer/>
        </>
    )
}