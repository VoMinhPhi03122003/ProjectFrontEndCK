import '../App.css'
import '../css/bootstrap.min.css'
import '../css/font-awesome.min.css'
import '../css/style.css'
import HeaderTop from './header_top'
import Logo from './logo'
import MenuBar from './menu_bar'
import Cart from './cart'

function Header() {
    return (
        <header className="header">
            <HeaderTop/>
            <div className="container">
                <div className="row">
                    <Logo/>
                    <MenuBar/>
                    <Cart/>
                </div>
            </div>
        </header>
    )
}

export default Header;