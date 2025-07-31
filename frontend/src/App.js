import React from 'react'
import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Homepage from './pages/Homepage/Homepage'
import Categories from './pages/Categories/Categories'
import Addcomponent from './components/usercurd/Addcomponent/Addcomponent'
import Read from './components/usercurd/Read/Read'
import Update from './components/usercurd/Update/Update'
import AddCategory from './components/Category/addcategory'
import UpdateCategory from './components/Category/Updatecategory'
import Supplier from './pages/Supplierpage/Supplier'
import AddSupplier from './components/supplier/suppliercomponen/AddSupplier'
import Readsupplier from './components/supplier/suppliercomponen/Readsupplier'
import UpdateSupplier from './components/supplier/suppliercomponen/UpdateSupplier'
import ProductForm from './components/productadder'
import Variations from './components/Variation/Variations'
import AddVariation from './components/Variation/AddVaraition'
import Userpage from './pages/Users/Userpage'
import Products from './pages/Products/Products'
import AddProduct from './components/Productcomponent/Addproduct'
import UpdateProduct from './components/Productcomponent/UpdateProduct'
import UpdateVariations from './components/Variation/UpdateVariations'
import PurchaseOrder from './components/Purchase/Purchaseorder'
import PurchaseOrderlist from './components/Purchase/PurchaseOrderList'
import AddPurchaseOrderDetail from './components/Purchase/Purchaseorderdetails'
import UpdatePurchaseOrderForm from './components/Purchase/Updatepurchaseorder'
import PurchaseOrderDetailList from './components/Purchase/PodDetaillist'
import AddPayment from './components/Supplierpayment/Addpayment'
import SupplierPaymentsList from './components/Supplierpayment/SPaymentlist'
import AddCustomer from './components/Customer/AddCustomer'
import CustomerComponent from './components/Customer/Customer'
import UpdateCustomer from './components/Customer/Updatecustomer'
import SalesOrderList from './components/Sales/Salesorderdetail'
import SalesOrderForm from './components/Sales/Salesorder'
import UpdateSalesOrderForm from './components/Sales/Updatesaleorder'
import AddSalesOrderDetail from './components/Sales/Salesorderdetail'
import StockComponent from './components/Stock/Stock'
import StockDetail from './components/Stock/StockDetails'
import PriceHistory from './components/Pricehistory/PriceHistory'
import SalesOrdershow from './components/Sales/Salesordershow'
import SaleOrderDetailList from './components/Sales/Sorderdeaillist'
import AddCustomerPayment from './components/Customerpayment/Customerpayments'
import GenericReceipt from './components/Recipt/Reciept'
import OverdueCustomers from './components/Supplierpayment/Overduepayment'
import CustomerPaymentsList from './components/Customerpayment/customerpaymentlist'
import EachCustomerPaymentsList from './components/Customerpayment/Readcpayment'
import ReportComponent from './components/Reporting/Report'
import CustomerLeisureShow from './components/LeisureCustomer/Customerleisure'
import SupplierLeisureShow from './components/Supplierleisure/Suppliereisure'
import ReturnOrderShow from './components/Return/Returnshow'
import ReturnOrderForm from './components/Return/Addreturn'
import AddReturnOrderDetail from './components/Return/Returnorderdetailform'
import UpdateReturnOrderForm from './components/Return/Updatereturnoder'
import PriceRuleForm from './components/PriceRule/addpricerule'
import PriceRuleList from './components/PriceRule/priceruleshow'
import EditPriceRuleForm from './components/PriceRule/editpricerule'
import AddExpense from './components/Expense/addExpense'
import ViewAllExpenses from './components/Expense/ViewExpense'
import ProfitLossScreen from './components/ProfitLoss/profitlossreport'
import AddHomeCustomerPayment from './components/Customerpayment/addcustomerpayment'
import AddReminder from './pages/Reminder/AddReminder'
import DisplayReminderComponent from './components/Reminder/DisplayReminderComponent'
import NotificationsPage from './components/NotificationBell'
import ProductVariationList from './components/Variation/AllVariation'
//import Home from './pages/Home'



function App() {
   return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/signup' element={<Signup />}></Route>
            <Route path='/Homepage' element={<Homepage />}></Route>
            <Route path='/categories' element={<Categories />}></Route>
            <Route path='/categories/add' element={<AddCategory />}></Route>
            <Route path='/categories/update/:id' element={<UpdateCategory />}></Route>


            <Route path='/users' element={<Userpage />}></Route>
            <Route path='/users/add' element={<Addcomponent />}></Route>
            <Route path='/users/read/:id' element={<Read />}></Route>
            <Route path='/users/update/:id' element={<Update />}></Route>

            <Route path='/suppliers' element={<Supplier />} />
            <Route path='/suppliers/add' element={<AddSupplier />} />
            <Route path='suppliers/read/:id' element={<Readsupplier />}></Route>
            <Route path='suppliers/update/:id' element={<UpdateSupplier />}></Route>

            <Route path='/customers' element={<CustomerComponent />} />
            <Route path='/customers/add' element={<AddCustomer />} />
            <Route path='customers/update/:id' element={<UpdateCustomer />}></Route>

            <Route path='/variations/:id' element={<Variations />} />
            <Route path='/variations/all' element={<ProductVariationList />} />

            <Route path='/variations/add' element={<AddVariation />}></Route>
            <Route path='/variations/update/:id' element={<UpdateVariations />}></Route>

            <Route path='/products' element={<Products />} />
            <Route path='/products/add' element={<AddProduct />}></Route>
            <Route path='/products/update/:id' element={<UpdateProduct />}></Route>

            <Route path='/purchaseorder' element={<PurchaseOrderlist />} />
            <Route path='/purchaseorders/add' element={<PurchaseOrder />} />
            <Route path='/purchaseorder/update/:id' element={<UpdatePurchaseOrderForm />}></Route>
            {/* <Route path='/purchaseorder/recipt/:id' element={<Receipt/>}></Route> */}




            <Route path='/purchaseorderdetail/:id' element={<AddPurchaseOrderDetail />} />
            <Route path='/orderdetail/:id' element={<PurchaseOrderDetailList />} />


            <Route path='/supplierpayment/add' element={<AddPayment />} />
            <Route path='/supplierpayment/list' element={<SupplierPaymentsList />} />

            <Route path='/customerpayment/add/:id' element={<AddCustomerPayment />} />
            <Route path='/customerpayment/list' element={<CustomerPaymentsList />} />
            <Route path='/customerpayment/add' element={<AddHomeCustomerPayment />} />


            <Route path='/customerpayment/:customerId' element={<EachCustomerPaymentsList />} />

            <Route path='/customerpayment/overdue' element={<OverdueCustomers />} />

            {/* <Route path='/supplierpayment/list' element={<SupplierPaymentsList />} /> */}

            <Route path='/salesorder/show' element={<SalesOrdershow />} />
            <Route path='/salesorder/add' element={<SalesOrderForm />} />
            <Route path='/salesorder/update/:id' element={<UpdateSalesOrderForm />}></Route>

            <Route path="/salesorder/receipt/:id" element={<GenericReceipt orderType="sales" />} />
            <Route path="/purchaseorder/receipt/:id" element={<GenericReceipt orderType="purchase" />} />


            <Route path='/salesorderdetail/:id' element={<AddSalesOrderDetail />} />
            <Route path='/salesorderdetaillist/:id' element={<SaleOrderDetailList />} />



            <Route path='/stocks' element={<StockComponent />} />
            <Route path="/stock/read/:variationID" element={<StockDetail />} />


            <Route path='/priceHistory/:id' element={<PriceHistory />} />

            <Route path='/report' element={<ReportComponent />} />


            <Route path='/customerleisure' element={<CustomerLeisureShow />} />
            <Route path='/supplierleisure' element={<SupplierLeisureShow />} />

            <Route path='/returnshow' element={<ReturnOrderShow />} />
            <Route path='/addreturn' element={<ReturnOrderForm />} />
            <Route path='/addreturndetails/:id' element={<AddReturnOrderDetail />} />
            <Route path='/updatereturnorder/:id' element={<UpdateReturnOrderForm />} />

            <Route path='/pricerule/add' element={<PriceRuleForm />} />
            <Route path='/pricerule/show' element={<PriceRuleList />} />
            <Route path='/pricerule/edit/:id' element={<EditPriceRuleForm />} />



            <Route path='/expense/addExpense' element={<AddExpense />} />
            <Route path='/expense/read' element={<ViewAllExpenses />} />

            <Route path='/profit-loss' element={<ProfitLossScreen />} />

            <Route path='/reminder/add' element={<AddReminder />} />
            <Route path='/reminder/display' element={<DisplayReminderComponent />} />



            <Route path='/notification' element={<NotificationsPage />} />










         </Routes>
      </BrowserRouter>

   )
}

export default App
