# 💼 BizManage - Invoice, Seller, and Customer Management  

BizManage is a web application for efficient management of invoices, sellers, and customers. 🚀  
It allows adding, editing, and deleting records with an intuitive user experience.  

## 💻 Technologies  
-  **React**  
-  **HTML & CSS**  

## 📋 Features  
 Invoice Management:  
- Fields: sellerName, customerName, date, amount, (id, sellerId, customerId).  

 Seller Management:  
- Fields: companyName, hqAddress, isActive, (id).  

 Customer Management:  
- Fields: name, surname, address, age, (id).  

## 🚀 Key Features  
- **Navigation**: Three pages (Invoices, Sellers, Customers) with the active page highlighted in the menu.  
- **CRUD Operations**: Add, edit, and delete records with row selection on click.  
- **Routing**: The URL dynamically updates based on the active page and the selected row.  
- **Modals**: Darkened backdrop and auto-filled data in the edit modal.  
- **Validation**: Toast notifications for errors and successful operations.  
- **Pagination**: Manage large sets of records.  
- **Entity Linking**: Connections between invoices, sellers, and customers.  
- **Multi-Row Selection**: Perform group actions on selected rows.  
- **Loading Indicator**: Visual loading feedback during mock backend communication.  

## 🧪 Mock Backend  
Supabase was used to handle data and simulate a REST API.  
