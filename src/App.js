import './App.css';
import './index.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './components/layout/layout';
import CategoryList from './components/category/CategoryList';
import ProductList from './components/products/ProductsList';
import UserList from './components/users/UserList';
import OrderList from './components/orders/OrderList';
import AddCategory from './components/category/AddCategory';
import AddProduct from './components/products/AddProduct';
import Privacy from './components/privacy/Privacy';
import Terms from './components/privacy/Terms';
import Contact from './components/privacy/Contact';
import Login from './components/login/Login';
function App() {
  return (
    <Router>
    <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/" element={<Layout />} >
    <Route path="/category" element={<CategoryList/>} />
    <Route path="/products" element={<ProductList />} />
    <Route path="/user-list" element={<UserList />} />
    <Route path="/order-list" element={<OrderList />} />
    <Route path="/add-category" element={<AddCategory />} />
    <Route path="/edit-category/:category_id" element={<AddCategory />} />
    <Route path="/add-product" element={<AddProduct />} />
    <Route path="/edit-product/:product_id" element={<AddProduct />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/contact" element={<Contact />} />
    </Route>
    </Routes>
    </Router>
  );
}
export default App;
